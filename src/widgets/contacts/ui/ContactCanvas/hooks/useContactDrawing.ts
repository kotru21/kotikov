import type { MutableRefObject,RefObject } from "react";
import { useCallback } from "react";

import { colors } from "@/styles/colors";

export const useContactDrawing = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  ctxRef: MutableRefObject<CanvasRenderingContext2D | null>,
  catMapRef: MutableRefObject<Map<string, string>>,
  revealedPixelsRef: MutableRefObject<Set<string>>,
  pixelSize: number,
  brushRadius: number
) => {
  const drawBackground = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Очистка с учетом того, что transform уже установлен в lifecycle
    ctx.clearRect(0, 0, rect.width, rect.height);

    const cols = Math.ceil(rect.width / pixelSize);
    const rows = Math.ceil(rect.height / pixelSize);
    const baseColors = [
      colors.primary[900],
      colors.primary[800],
      colors.primary[700],
    ];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * pixelSize;
        const y = row * pixelSize;
        const key = `${col},${row}`;
        const isCat = catMapRef.current.has(key);

        const progress = (row + col) / (rows + cols);
        const colorIndex = Math.floor(progress * (baseColors.length - 1));

        ctx.fillStyle = isCat ? colors.accent[950] : baseColors[colorIndex];

        if (isCat) {
          ctx.fillStyle = colors.primary[950];
        }

        ctx.fillRect(x, y, pixelSize, pixelSize);

        ctx.strokeStyle = colors.primary[600] + "20";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, pixelSize, pixelSize);
      }
    }
  }, [pixelSize, canvasRef, ctxRef, catMapRef]);

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

      const pixelsToDrawThisFrame = new Map<
        string,
        { x: number; y: number; color: string; intensity: number }
      >();

      for (let i = 0; i <= steps; i++) {
        const t = steps > 0 ? i / steps : 0;
        const interpX = canvasPrevX + (canvasX - canvasPrevX) * t;
        const interpY = canvasPrevY + (canvasY - canvasPrevY) * t;

        const brushRadiusInPixels = Math.ceil(brushRadius / pixelSize);

        for (let dy = -brushRadiusInPixels; dy <= brushRadiusInPixels; dy++) {
          for (let dx = -brushRadiusInPixels; dx <= brushRadiusInPixels; dx++) {
            const pixelCenterX =
              Math.floor(interpX / pixelSize) * pixelSize +
              pixelSize / 2 +
              dx * pixelSize;
            const pixelCenterY =
              Math.floor(interpY / pixelSize) * pixelSize +
              pixelSize / 2 +
              dy * pixelSize;

            const distanceFromBrush = Math.hypot(
              pixelCenterX - interpX,
              pixelCenterY - interpY
            );

            if (distanceFromBrush <= brushRadius) {
              const pixelX = pixelCenterX - pixelSize / 2;
              const pixelY = pixelCenterY - pixelSize / 2;
              const col = Math.round(pixelX / pixelSize);
              const row = Math.round(pixelY / pixelSize);
              const key = `${col},${row}`;

              if (revealedPixelsRef.current.has(key)) continue;

              const intensity = 1 - distanceFromBrush / brushRadius;
              const catColor = catMapRef.current.get(key);

              let fillColor: string;

              if (catColor) {
                fillColor = catColor;
              } else {
                const variation = Math.random();
                if (variation > 0.92) {
                  fillColor = colors.accent[200];
                } else if (variation > 0.85) {
                  fillColor = colors.accent[600];
                } else {
                  fillColor = colors.accent[300];
                }
              }

              const existing = pixelsToDrawThisFrame.get(key);
              if (!existing || intensity > existing.intensity) {
                pixelsToDrawThisFrame.set(key, {
                  x: pixelX,
                  y: pixelY,
                  color: fillColor,
                  intensity,
                });
              }
            }
          }
        }
      }

      for (const [key, { x, y, color }] of pixelsToDrawThisFrame) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, pixelSize, pixelSize);
        revealedPixelsRef.current.add(key);
      }

      ctx.strokeStyle = colors.primary[600] + "15";
      ctx.lineWidth = 0.5;
      for (const [, { x, y }] of pixelsToDrawThisFrame) {
        ctx.strokeRect(x, y, pixelSize, pixelSize);
      }
    },
    [brushRadius, pixelSize, canvasRef, ctxRef, catMapRef, revealedPixelsRef]
  );

  return { drawBackground, drawOnCanvas };
};
