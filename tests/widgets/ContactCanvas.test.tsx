import { act, render, renderHook } from "@testing-library/react";
import { createRef, type RefObject } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ContactCanvas from "@/widgets/contacts/ui/ContactCanvas/ContactCanvas";
import { useContactCats } from "@/widgets/contacts/ui/ContactCanvas/hooks/useContactCats";
import { useContactDrawing } from "@/widgets/contacts/ui/ContactCanvas/hooks/useContactDrawing";
import { useContactLifecycle } from "@/widgets/contacts/ui/ContactCanvas/hooks/useContactLifecycle";

function createMockContext(): CanvasRenderingContext2D {
  return {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    setTransform: vi.fn(),
    scale: vi.fn(),
    globalAlpha: 1,
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    imageSmoothingEnabled: true,
    globalCompositeOperation: "source-over",
  } as unknown as CanvasRenderingContext2D;
}

function mockCanvasElement(ctx: CanvasRenderingContext2D): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  Object.defineProperty(canvas, "getBoundingClientRect", {
    value: () => ({
      left: 0,
      top: 0,
      right: 160,
      bottom: 120,
      width: 160,
      height: 120,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }),
  });
  canvas.getContext = vi.fn(() => ctx) as unknown as typeof canvas.getContext;
  return canvas;
}

describe("useContactCats", () => {
  it("populates cat and revealed maps for a large grid", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.01);

    const { result } = renderHook(() => useContactCats());

    act(() => {
      result.current.generateCats(40, 60);
    });

    expect(result.current.catMapRef.current.size).toBeGreaterThan(0);

    act(() => {
      result.current.generateCats(40, 60);
    });
    expect(result.current.revealedMapRef.current.size).toBe(0);

    vi.restoreAllMocks();
  });

  it("handles empty grids without throwing", () => {
    const { result } = renderHook(() => useContactCats());

    act(() => {
      result.current.generateCats(0, 0);
    });

    expect(result.current.catMapRef.current.size).toBe(0);
  });
});

describe("useContactDrawing", () => {
  it("draws background cells and brush strokes onto the canvas", () => {
    const ctx = createMockContext();
    const canvas = mockCanvasElement(ctx);
    const canvasRef = { current: canvas };
    const ctxRef = { current: ctx };
    const catMapRef = { current: new Map([["0,0", "#ff00aa"]]) };
    const revealedMapRef = {
      current: new Map<string, { color: string; intensity: number }>(),
    };

    const { result } = renderHook(() =>
      useContactDrawing(canvasRef, ctxRef, catMapRef, revealedMapRef, 8, 20)
    );

    act(() => {
      result.current.drawBackground();
    });
    // eslint-disable-next-line @typescript-eslint/unbound-method -- vitest mock fn assertion
    expect(ctx.clearRect).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method -- vitest mock fn assertion
    expect(ctx.fillRect).toHaveBeenCalled();

    act(() => {
      result.current.drawOnCanvas(16, 16, 8, 8);
    });
    expect(revealedMapRef.current.size).toBeGreaterThan(0);

    const firstKeyResult = revealedMapRef.current.keys().next();
    expect(firstKeyResult.done).toBe(false);
    if (firstKeyResult.done) throw new Error("expected revealed map key");
    const firstKey = firstKeyResult.value;
    const firstEntry = revealedMapRef.current.get(firstKey);
    expect(firstEntry).toBeDefined();
    if (!firstEntry) throw new Error("expected revealed map entry");

    act(() => {
      result.current.drawOnCanvas(16, 16, 8, 8);
    });
    expect(revealedMapRef.current.get(firstKey)?.intensity).toBeGreaterThanOrEqual(
      firstEntry.intensity
    );
  });

  it("no-ops when canvas context is missing", () => {
    const canvasRef = { current: null };
    const ctxRef = { current: null };
    const catMapRef = { current: new Map<string, string>() };
    const revealedMapRef = {
      current: new Map<string, { color: string; intensity: number }>(),
    };

    const { result } = renderHook(() =>
      useContactDrawing(canvasRef, ctxRef, catMapRef, revealedMapRef, 8, 20)
    );

    expect(() => {
      result.current.drawBackground();
      result.current.drawOnCanvas(1, 1, 0, 0);
    }).not.toThrow();
  });
});

describe("useContactLifecycle", () => {
  beforeEach(() => {
    vi.stubGlobal("devicePixelRatio", 2);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("initializes canvas, regenerates cats, and reports coverage", () => {
    const ctx = createMockContext();
    const canvas = mockCanvasElement(ctx);
    const canvasRef = { current: canvas };
    const ctxRef: RefObject<CanvasRenderingContext2D | null> = { current: null };
    const generateCats = vi.fn();
    const drawBackground = vi.fn();
    const revealedMapRef = {
      current: new Map([
        ["1,1", { color: "#abc", intensity: 0.8 }],
        ["99,99", { color: "#def", intensity: 0.4 }],
      ]),
    };

    const { result } = renderHook(() =>
      useContactLifecycle(canvasRef, ctxRef, 8, generateCats, drawBackground, revealedMapRef)
    );

    act(() => {
      result.current.initCanvas();
    });

    expect(ctxRef.current).toBe(ctx);
    expect(generateCats).toHaveBeenCalled();
    expect(drawBackground).toHaveBeenCalled();
    expect(revealedMapRef.current.has("99,99")).toBe(false);
    expect(revealedMapRef.current.has("1,1")).toBe(true);

    const coverage = result.current.checkCoverage(new DOMRect(0, 0, 40, 40));
    expect(coverage).toBeGreaterThanOrEqual(0);
  });

  it("returns zero coverage without a canvas", () => {
    const canvasRef = { current: null };
    const ctxRef = { current: null };
    const revealedMapRef = {
      current: new Map<string, { color: string; intensity: number }>(),
    };

    const { result } = renderHook(() =>
      useContactLifecycle(canvasRef, ctxRef, 8, vi.fn(), vi.fn(), revealedMapRef)
    );

    expect(result.current.checkCoverage(new DOMRect(0, 0, 10, 10))).toBe(0);
  });
});

describe("ContactCanvas", () => {
  it("exposes imperative canvas helpers through the ref", () => {
    const ctx = createMockContext();
    const getContext = vi.fn(() => ctx);
    HTMLCanvasElement.prototype.getContext =
      getContext as unknown as typeof HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      right: 200,
      bottom: 160,
      width: 200,
      height: 160,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    const ref = createRef<{
      drawOnCanvas: (x: number, y: number, prevX: number, prevY: number) => void;
      initCanvas: () => void;
      checkCoverage: (rect: DOMRect) => number;
    }>();

    render(<ContactCanvas ref={ref} />);

    expect(ref.current).toBeTruthy();
    act(() => {
      ref.current?.initCanvas();
      ref.current?.drawOnCanvas(20, 20, 10, 10);
    });
    expect(typeof ref.current?.checkCoverage(new DOMRect(0, 0, 20, 20))).toBe("number");
  });
});
