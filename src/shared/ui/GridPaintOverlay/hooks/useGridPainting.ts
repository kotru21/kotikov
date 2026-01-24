import { type RefObject, useCallback, useRef } from "react";

import { sampleBrushStroke } from "@/shared/ui"; 
import { colors } from "@/styles/colors";

interface UseGridPaintingReturn {
  paintedRef: RefObject<Map<string, string>>;
  drawOnCanvas: (x: number, y: number, prevX: number, prevY: number) => void;
}

export const useGridPainting = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  ctxRef: RefObject<CanvasRenderingContext2D | null>,
  pixelSize: number,
  brushRadius: number,
  alpha: number
): UseGridPaintingReturn => {
  const paintedRef = useRef<Map<string, string>>(new Map());

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

      ctx.globalAlpha = alpha;
      for (const [key, { x: px, y: py }] of pixelsToDraw) {
        const existingColor = paintedRef.current.get(key);
        if (existingColor !== undefined) {
          // Already painted — keep its color and avoid redraw to prevent flicker
          continue;
        }

        const r = Math.random();
        let fillColor: string = colors.accent[300];
        if (r > 0.92) fillColor = colors.accent[200];
        else if (r > 0.84) fillColor = colors.accent[600];
        else if (r > 0.76) fillColor = colors.accent[500];

        paintedRef.current.set(key, fillColor);
        ctx.fillStyle = fillColor;
        ctx.fillRect(px, py, pixelSize, pixelSize);
      }
      ctx.globalAlpha = 1;
    },
    [alpha, brushRadius, pixelSize, canvasRef, ctxRef]
  );

  return { paintedRef, drawOnCanvas };
};
