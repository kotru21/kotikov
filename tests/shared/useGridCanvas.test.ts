import { act, renderHook } from "@testing-library/react";
import { type RefObject } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useGridCanvas } from "@/shared/ui/GridPaintOverlay/hooks/useGridCanvas";

function createMockContext(): CanvasRenderingContext2D {
  return {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    setTransform: vi.fn(),
    scale: vi.fn(),
    globalAlpha: 1,
    fillStyle: "",
    imageSmoothingEnabled: true,
    globalCompositeOperation: "source-over",
  } as unknown as CanvasRenderingContext2D;
}

function mockCanvasElement(
  ctx: CanvasRenderingContext2D,
  size: { width: number; height: number } = { width: 160, height: 120 }
): HTMLCanvasElement & { setMockSize: (next: { width: number; height: number }) => void } {
  const canvas = document.createElement("canvas") as HTMLCanvasElement & {
    setMockSize: (next: { width: number; height: number }) => void;
  };
  let currentSize = size;
  Object.defineProperty(canvas, "getBoundingClientRect", {
    configurable: true,
    value: () => ({
      left: 0,
      top: 0,
      right: currentSize.width,
      bottom: currentSize.height,
      width: currentSize.width,
      height: currentSize.height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }),
  });
  canvas.setMockSize = (next): void => {
    currentSize = next;
  };
  canvas.getContext = vi.fn(() => ctx) as unknown as typeof canvas.getContext;
  return canvas;
}

describe("useGridCanvas", () => {
  beforeEach(() => {
    vi.stubGlobal("devicePixelRatio", 1);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("skips redraw when initCanvas repeats with the same CSS size and DPR", () => {
    const ctx = createMockContext();
    const canvas = mockCanvasElement(ctx, { width: 160, height: 120 });
    const canvasRef = { current: canvas };
    const ctxRef: RefObject<CanvasRenderingContext2D | null> = { current: null };
    const paintedRef = {
      current: new Map([["0,0", { color: "#ff00aa", intensity: 1 }]]),
    };

    const { result } = renderHook(() =>
      useGridCanvas(canvasRef, ctxRef, 0.5, 8, paintedRef)
    );

    const clearsAfterMount = (ctx.clearRect as ReturnType<typeof vi.fn>).mock.calls.length;
    expect(clearsAfterMount).toBeGreaterThan(0);
    expect(canvas.width).toBe(160);
    expect(canvas.height).toBe(120);

    act(() => {
      result.current.initCanvas();
      result.current.initCanvas();
    });

    expect(ctx.clearRect).toHaveBeenCalledTimes(clearsAfterMount);
  });

  it("reinitializes when CSS size changes", () => {
    const ctx = createMockContext();
    const canvas = mockCanvasElement(ctx, { width: 160, height: 120 });
    const canvasRef = { current: canvas };
    const ctxRef: RefObject<CanvasRenderingContext2D | null> = { current: null };
    const paintedRef = {
      current: new Map([["0,0", { color: "#ff00aa", intensity: 1 }]]),
    };

    const { result } = renderHook(() =>
      useGridCanvas(canvasRef, ctxRef, 0.5, 8, paintedRef)
    );

    const clearsAfterMount = (ctx.clearRect as ReturnType<typeof vi.fn>).mock.calls.length;
    canvas.setMockSize({ width: 200, height: 150 });

    act(() => {
      result.current.initCanvas();
    });

    expect(ctx.clearRect).toHaveBeenCalledTimes(clearsAfterMount + 1);
    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(150);
  });
});
