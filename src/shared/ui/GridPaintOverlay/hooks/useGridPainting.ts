import { type RefObject, useCallback, useRef } from "react";

import { sampleBrushStroke } from "@/shared/ui"; 
import { colors } from "@/styles/colors";

interface UseGridPaintingReturn {
  paintedRef: RefObject<Map<string, { color: string; intensity: number }>>;
  drawOnCanvas: (x: number, y: number, prevX: number, prevY: number) => void;
}

export const useGridPainting = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  ctxRef: RefObject<CanvasRenderingContext2D | null>,
  pixelSize: number,
  brushRadius: number,
  alpha: number
): UseGridPaintingReturn => {
  const paintedRef = useRef<Map<string, { color: string; intensity: number }>>(new Map());

  const drawOnCanvas = useCallback(
    (x: number, y: number, prevX: number, prevY: number): void => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;

      const rect = canvas.getBoundingClientRect();
      const canvasX = x - rect.left;
      const canvasY = y - rect.top;
      const canvasPrevX = prevX - rect.left;
      const canvasPrevY = prevY - rect.top;

      const pixelsToDraw = sampleBrushStroke(
        canvasX,
        canvasY,
        canvasPrevX,
        canvasPrevY,
        pixelSize,
        brushRadius
      );

      for (const [key, { x: px, y: py, intensity }] of pixelsToDraw) {
        const existing = paintedRef.current.get(key);

        if (existing !== undefined) {
          // If intensity did not increase, skip redraw to avoid flicker
          if (intensity <= existing.intensity) continue;

          // Intensity increased - keep color but update intensity and redraw with stronger alpha
          existing.intensity = intensity;
          ctx.globalAlpha = alpha * intensity;
          ctx.fillStyle = existing.color;
          ctx.fillRect(px, py, pixelSize, pixelSize);
          continue;
        }

        const r = Math.random();
        let fillColor: string = colors.accent[300];
        if (r > 0.92) fillColor = colors.accent[200];
        else if (r > 0.84) fillColor = colors.accent[600];
        else if (r > 0.76) fillColor = colors.accent[500];

        paintedRef.current.set(key, { color: fillColor, intensity });
        ctx.globalAlpha = alpha * intensity;
        ctx.fillStyle = fillColor;
        ctx.fillRect(px, py, pixelSize, pixelSize);
      }

      ctx.globalAlpha = 1;
    },
    [alpha, brushRadius, pixelSize, canvasRef, ctxRef]
  );

  return { paintedRef, drawOnCanvas };
};
