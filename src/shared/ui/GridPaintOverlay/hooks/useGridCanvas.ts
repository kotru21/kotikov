import { type RefObject, useCallback } from "react";

import { useCanvasLifecycle } from "@/shared/ui";

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

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
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

  useCanvasLifecycle(initCanvas);

  return { initCanvas };
};
