import type { RefObject } from "react";
import { useCallback, useRef } from "react";

import { colors } from "@/styles/colors";

export const useGridPainting = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  ctxRef: RefObject<CanvasRenderingContext2D | null>,
  pixelSize: number,
  brushRadius: number,
  alpha: number
) => {
  const paintedRef = useRef<Map<string, string>>(new Map());

  const drawOnCanvas = useCallback(
    (x: number, y: number, prevX: number, prevY: number) => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;

      const rect = canvas.getBoundingClientRect();
      const canvasX = x - rect.left;
      const canvasY = y - rect.top;
      const canvasPrevX = prevX - rect.left;
      const canvasPrevY = prevY - rect.top;

      const distance = Math.hypot(canvasX - canvasPrevX, canvasY - canvasPrevY);
      const steps = Math.max(1, Math.floor(distance / 3));

      const pixelsToDraw = new Map<
        string,
        { x: number; y: number; color: string; intensity: number }
      >();

      for (let i = 0; i <= steps; i++) {
        const t = steps > 0 ? i / steps : 0;
        const interpX = canvasPrevX + (canvasX - canvasPrevX) * t;
        const interpY = canvasPrevY + (canvasY - canvasPrevY) * t;
        const brushRadPx = Math.ceil(brushRadius / pixelSize);

        for (let dy = -brushRadPx; dy <= brushRadPx; dy++) {
          for (let dx = -brushRadPx; dx <= brushRadPx; dx++) {
            const centerX =
              Math.floor(interpX / pixelSize) * pixelSize +
              pixelSize / 2 +
              dx * pixelSize;
            const centerY =
              Math.floor(interpY / pixelSize) * pixelSize +
              pixelSize / 2 +
              dy * pixelSize;

            const dist = Math.hypot(centerX - interpX, centerY - interpY);
            if (dist > brushRadius) continue;

            const intensity = 1 - dist / brushRadius;
            const col = Math.round((centerX - pixelSize / 2) / pixelSize);
            const row = Math.round((centerY - pixelSize / 2) / pixelSize);
            const key = `${col},${row}`;

            const existing = pixelsToDraw.get(key);
            if (existing && existing.intensity >= intensity) continue;

            const r = Math.random();
            let fillColor: string = colors.accent[300];
            if (r > 0.92) fillColor = colors.accent[200];
            else if (r > 0.84) fillColor = colors.accent[600];
            else if (r > 0.76) fillColor = colors.accent[500];

            pixelsToDraw.set(key, {
              x: col * pixelSize,
              y: row * pixelSize,
              color: fillColor,
              intensity,
            });
          }
        }
      }

      ctx.globalAlpha = alpha;
      for (const [key, { x: px, y: py, color }] of pixelsToDraw) {
        paintedRef.current.set(key, color);
        ctx.fillStyle = color;
        ctx.fillRect(px, py, pixelSize, pixelSize);
      }
      ctx.globalAlpha = 1;
    },
    [alpha, brushRadius, pixelSize, canvasRef, ctxRef]
  );

  return { paintedRef, drawOnCanvas };
};
