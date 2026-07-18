import { act, render, renderHook } from "@testing-library/react";
import { createRef, type RefObject } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  CONTACT_BRUSH_RADIUS,
  CONTACT_CANVAS_PIXEL_SIZE,
} from "@/widgets/contacts/ui/constants";
import ContactCanvas from "@/widgets/contacts/ui/ContactCanvas/ContactCanvas";
import { useContactCats } from "@/widgets/contacts/ui/ContactCanvas/hooks/useContactCats";
import { useContactDrawing } from "@/widgets/contacts/ui/ContactCanvas/hooks/useContactDrawing";
import { useContactLifecycle } from "@/widgets/contacts/ui/ContactCanvas/hooks/useContactLifecycle";
import { useContactPaintState } from "@/widgets/contacts/ui/ContactCanvas/hooks/useContactPaintState";

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

function mockCanvasElement(
  ctx: CanvasRenderingContext2D,
  size: { width: number; height: number } = { width: 160, height: 120 }
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  Object.defineProperty(canvas, "getBoundingClientRect", {
    value: () => ({
      left: 0,
      top: 0,
      right: size.width,
      bottom: size.height,
      width: size.width,
      height: size.height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }),
  });
  canvas.getContext = vi.fn(() => ctx) as unknown as typeof canvas.getContext;
  return canvas;
}

describe("useContactCats", () => {
  it("populates cat map without clearing revealed paint", () => {
    const { result } = renderHook(() => useContactCats({ random: () => 0.01 }));
    const paint = renderHook(() => useContactPaintState());

    paint.result.current.revealedMapRef.current.set("1,1", {
      color: "#abc",
      intensity: 0.5,
    });

    act(() => {
      result.current.generateCats(40, 60);
    });

    expect(result.current.catMapRef.current.size).toBeGreaterThan(0);
    expect(paint.result.current.revealedMapRef.current.size).toBe(1);
  });

  it("handles empty grids without throwing", () => {
    const { result } = renderHook(() => useContactCats({ random: () => 0.01 }));

    act(() => {
      result.current.generateCats(0, 0);
    });

    expect(result.current.catMapRef.current.size).toBe(0);
  });
});

describe("useContactPaintState", () => {
  it("clears revealed paint on demand", () => {
    const { result } = renderHook(() => useContactPaintState());

    result.current.revealedMapRef.current.set("0,0", { color: "#fff", intensity: 1 });
    act(() => {
      result.current.clearPaint();
    });
    expect(result.current.revealedMapRef.current.size).toBe(0);
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
      useContactDrawing(
        canvasRef,
        ctxRef,
        catMapRef,
        revealedMapRef,
        CONTACT_CANVAS_PIXEL_SIZE,
        CONTACT_BRUSH_RADIUS,
        { random: () => 0.5 }
      )
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
    if (firstKeyResult.done === true) throw new Error("expected revealed map key");
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
      useContactDrawing(
        canvasRef,
        ctxRef,
        catMapRef,
        revealedMapRef,
        CONTACT_CANVAS_PIXEL_SIZE,
        CONTACT_BRUSH_RADIUS
      )
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
    const clearPaint = vi.fn();
    const revealedMapRef = {
      current: new Map([
        ["1,1", { color: "#abc", intensity: 0.8 }],
        ["99,99", { color: "#def", intensity: 0.4 }],
      ]),
    };

    const { result } = renderHook(() =>
      useContactLifecycle(
        canvasRef,
        ctxRef,
        CONTACT_CANVAS_PIXEL_SIZE,
        generateCats,
        drawBackground,
        revealedMapRef,
        clearPaint
      )
    );

    act(() => {
      result.current.initCanvas();
    });

    expect(ctxRef.current).toBe(ctx);
    expect(generateCats).toHaveBeenCalled();
    expect(drawBackground).toHaveBeenCalled();
    expect(clearPaint).not.toHaveBeenCalled();
    expect(revealedMapRef.current.has("99,99")).toBe(false);
    expect(revealedMapRef.current.has("1,1")).toBe(true);

    const coverage = result.current.checkCoverage(new DOMRect(0, 0, 40, 40));
    expect(coverage).toBeGreaterThanOrEqual(0);
  });

  it("clears drawing without regenerating cats", () => {
    const ctx = createMockContext();
    const canvas = mockCanvasElement(ctx);
    const canvasRef = { current: canvas };
    const ctxRef: RefObject<CanvasRenderingContext2D | null> = { current: null };
    const generateCats = vi.fn();
    const drawBackground = vi.fn();
    const clearPaint = vi.fn(() => {
      revealedMapRef.current.clear();
    });
    const revealedMapRef = {
      current: new Map([["1,1", { color: "#abc", intensity: 0.8 }]]),
    };

    const { result } = renderHook(() =>
      useContactLifecycle(
        canvasRef,
        ctxRef,
        CONTACT_CANVAS_PIXEL_SIZE,
        generateCats,
        drawBackground,
        revealedMapRef,
        clearPaint
      )
    );

    // Lifecycle mounts with initCanvas once — ignore that for the clear assertion.
    generateCats.mockClear();
    drawBackground.mockClear();
    clearPaint.mockClear();

    act(() => {
      result.current.clearDrawing();
    });

    expect(clearPaint).toHaveBeenCalled();
    expect(drawBackground).toHaveBeenCalled();
    expect(generateCats).not.toHaveBeenCalled();
    expect(revealedMapRef.current.size).toBe(0);
  });

  it("does not regenerate cats when the hook re-renders with stable deps", () => {
    const ctx = createMockContext();
    const canvas = mockCanvasElement(ctx);
    const canvasRef = { current: canvas };
    const ctxRef: RefObject<CanvasRenderingContext2D | null> = { current: null };
    const generateCats = vi.fn();
    const drawBackground = vi.fn();
    const clearPaint = vi.fn();
    const revealedMapRef = {
      current: new Map<string, { color: string; intensity: number }>(),
    };

    const { rerender } = renderHook(() =>
      useContactLifecycle(
        canvasRef,
        ctxRef,
        CONTACT_CANVAS_PIXEL_SIZE,
        generateCats,
        drawBackground,
        revealedMapRef,
        clearPaint
      )
    );

    const callsAfterMount = generateCats.mock.calls.length;
    expect(callsAfterMount).toBeGreaterThan(0);

    rerender();
    rerender();

    expect(generateCats).toHaveBeenCalledTimes(callsAfterMount);
  });

  it("returns zero coverage without a canvas", () => {
    const canvasRef = { current: null };
    const ctxRef = { current: null };
    const revealedMapRef = {
      current: new Map<string, { color: string; intensity: number }>(),
    };

    const { result } = renderHook(() =>
      useContactLifecycle(canvasRef, ctxRef, CONTACT_CANVAS_PIXEL_SIZE, vi.fn(), vi.fn(), revealedMapRef, vi.fn())
    );

    expect(result.current.checkCoverage(new DOMRect(0, 0, 10, 10))).toBe(0);
  });
});

describe("ContactCanvas paint preservation (S7-02 / S7-08)", () => {
  beforeEach(() => {
    vi.stubGlobal("devicePixelRatio", 1);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("preserves revealed paint across resize init and clears drawing without regenerating cats", () => {
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
      clearDrawing: () => void;
      checkCoverage: (rect: DOMRect) => number;
      sampleContrast: (rect: DOMRect) => {
        coverage: number;
        luminance: number | null;
        preferDarkText: boolean;
      };
    }>();

    // Wire real triad without React mount: cats + paint + drawing + lifecycle
    const cats = renderHook(() => useContactCats({ random: () => 0.01 }));
    const paint = renderHook(() => useContactPaintState());
    const canvas = mockCanvasElement(ctx, { width: 200, height: 160 });
    const canvasRef = { current: canvas };
    const ctxRef: RefObject<CanvasRenderingContext2D | null> = { current: null };

    const drawing = renderHook(() =>
      useContactDrawing(
        canvasRef,
        ctxRef,
        cats.result.current.catMapRef,
        paint.result.current.revealedMapRef,
        CONTACT_CANVAS_PIXEL_SIZE,
        CONTACT_BRUSH_RADIUS,
        { random: () => 0.5 }
      )
    );

    const lifecycle = renderHook(() =>
      useContactLifecycle(
        canvasRef,
        ctxRef,
        CONTACT_CANVAS_PIXEL_SIZE,
        cats.result.current.generateCats,
        drawing.result.current.drawBackground,
        paint.result.current.revealedMapRef,
        paint.result.current.clearPaint
      )
    );

    act(() => {
      lifecycle.result.current.initCanvas();
      // Center stroke so sampled cells stay inside the 200×160 / 8px grid.
      drawing.result.current.drawOnCanvas(100, 80, 96, 76);
    });

    expect(paint.result.current.revealedMapRef.current.size).toBeGreaterThan(0);
    const inBoundsKey = "12,10";
    paint.result.current.revealedMapRef.current.set(inBoundsKey, {
      color: "#feed",
      intensity: 1,
    });

    act(() => {
      lifecycle.result.current.initCanvas();
    });
    // Resize/init regenerates cats but must keep in-bounds revealed paint (S7-02).
    expect(paint.result.current.revealedMapRef.current.has(inBoundsKey)).toBe(true);
    expect(paint.result.current.revealedMapRef.current.size).toBeGreaterThan(0);

    const catSnapshot = new Map(cats.result.current.catMapRef.current);

    act(() => {
      lifecycle.result.current.clearDrawing();
    });
    expect(paint.result.current.revealedMapRef.current.size).toBe(0);
    expect(paint.result.current.revealedMapRef.current.has(inBoundsKey)).toBe(false);
    // Clear must keep the same cat silhouettes (no regenerate).
    expect(cats.result.current.catMapRef.current).toEqual(catSnapshot);

    // Imperative ContactCanvas ref exposes initCanvas / clearDrawing / draw / coverage
    render(<ContactCanvas ref={ref} />);
    expect(ref.current).toBeTruthy();
    act(() => {
      ref.current?.initCanvas();
      ref.current?.drawOnCanvas(20, 20, 10, 10);
    });

    const sample = ref.current?.sampleContrast(new DOMRect(0, 0, 20, 20));
    expect(sample).toEqual(
      expect.objectContaining({
        coverage: expect.any(Number),
        preferDarkText: expect.any(Boolean),
      })
    );

    act(() => {
      ref.current?.clearDrawing();
    });
    expect(typeof ref.current?.checkCoverage(new DOMRect(0, 0, 20, 20))).toBe("number");
  });
});
