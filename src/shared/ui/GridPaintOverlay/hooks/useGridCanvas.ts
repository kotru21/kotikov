import { type RefObject, useCallback } from "react";

import { useCanvasLifecycle } from "../../hooks/useCanvasLifecycle";

interface UseGridCanvasReturn {
  initCanvas: () => void;
}

export const useGridCanvas = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  ctxRef: RefObject<CanvasRenderingContext2D | null>,
  alpha: number,
  pixelSize: number,
  paintedRef: RefObject<Map<string, { color: string; intensity: number }>>
): UseGridCanvasReturn => {
  const initCanvas = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);
    const nextWidth = Math.max(1, Math.floor(rect.width * dpr));
    const nextHeight = Math.max(1, Math.floor(rect.height * dpr));

    // Resize/URL-bar churn can re-fire init with an unchanged CSS box × DPR.
    // Reassigning canvas.width/height clears the bitmap — skip when unchanged.
    if (canvas.width === nextWidth && canvas.height === nextHeight) {
      return;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    canvas.width = nextWidth;
    canvas.height = nextHeight;
    ctx.scale(dpr, dpr);

    ctx.imageSmoothingEnabled = false;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, rect.width, rect.height);

    for (const [key, entry] of paintedRef.current) {
      const [c, r] = key.split(",");
      const color = entry.color;
      const intensity = entry.intensity;
      ctx.globalAlpha = alpha * intensity;
      ctx.fillStyle = color;
      ctx.fillRect(Number(c) * pixelSize, Number(r) * pixelSize, pixelSize, pixelSize);
    }
    ctx.globalAlpha = 1;
  }, [alpha, pixelSize, paintedRef, canvasRef, ctxRef]);

  useCanvasLifecycle(initCanvas, canvasRef);

  return { initCanvas };
};
