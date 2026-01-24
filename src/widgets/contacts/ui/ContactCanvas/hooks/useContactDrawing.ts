import { type RefObject, useCallback } from "react";

import { sampleBrushStroke } from "@/shared/ui";
import { colors } from "@/styles/colors";

interface UseContactDrawingReturn {
  drawBackground: () => void;
  drawOnCanvas: (x: number, y: number, prevX: number, prevY: number) => void;
}

export const useContactDrawing = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  ctxRef: RefObject<CanvasRenderingContext2D | null>,
  catMapRef: RefObject<Map<string, string>>,
  revealedMapRef: RefObject<Map<string, string>>,
  pixelSize: number,
  brushRadius: number
): UseContactDrawingReturn => {
  const drawBackground = useCallback((): void => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Очистка с учетом того, что transform уже установлен в lifecycle
    ctx.clearRect(0, 0, rect.width, rect.height);

    const cols = Math.ceil(rect.width / pixelSize);
    const rows = Math.ceil(rect.height / pixelSize);
    const baseColors = [colors.primary[900], colors.primary[800], colors.primary[700]];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * pixelSize;
        const y = row * pixelSize;
        const key = `${String(col)},${String(row)}`;
        const isCat = catMapRef.current.has(key);

        const progress = (row + col) / (rows + cols);
        const colorIndex = Math.floor(progress * (baseColors.length - 1));

        ctx.fillStyle = isCat ? colors.accent[950] : baseColors[colorIndex];

        if (isCat) {
          ctx.fillStyle = colors.primary[950];
        }

        ctx.fillRect(x, y, pixelSize, pixelSize);

        ctx.strokeStyle = `${colors.primary[600]}20`;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, pixelSize, pixelSize);
      }
    }
  }, [pixelSize, canvasRef, ctxRef, catMapRef]);

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

      const pixelsToDraw = sampleBrushStroke(canvasX, canvasY, canvasPrevX, canvasPrevY, pixelSize, brushRadius);

      const newDrawn: Array<{ x: number; y: number }> = [];

      for (const [key, { x: px, y: py }] of pixelsToDraw) {
        if (revealedMapRef.current.has(key)) continue;

        const catColor = catMapRef.current.get(key);

        let fillColor: string;

        if (catColor !== undefined && catColor !== "") {
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

        ctx.fillStyle = fillColor;
        ctx.fillRect(px, py, pixelSize, pixelSize);
        revealedMapRef.current.set(key, fillColor);
        newDrawn.push({ x: px, y: py });
      }

      ctx.strokeStyle = `${colors.primary[600]}15`;
      ctx.lineWidth = 0.5;
      for (const p of newDrawn) {
        ctx.strokeRect(p.x, p.y, pixelSize, pixelSize);
      }
    },
    [brushRadius, pixelSize, canvasRef, ctxRef, catMapRef, revealedMapRef]
  );

  return { drawBackground, drawOnCanvas };
};
