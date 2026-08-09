import { type RefObject, useCallback } from "react";

import { sampleBrushStroke } from "@/shared/lib";
import { colors } from "@/styles/colors";

import type { RevealedPaintEntry } from "./useContactPaintState";

interface UseContactDrawingOptions {
  /** Injectable RNG for sparkle fill colors in tests; production defaults to Math.random. */
  random?: () => number;
}

interface UseContactDrawingReturn {
  drawBackground: () => void;
  drawOnCanvas: (x: number, y: number, prevX: number, prevY: number) => void;
}

export const useContactDrawing = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  ctxRef: RefObject<CanvasRenderingContext2D | null>,
  catMapRef: RefObject<Map<string, string>>,
  revealedMapRef: RefObject<Map<string, RevealedPaintEntry>>,
  pixelSize: number,
  brushRadius: number,
  options: UseContactDrawingOptions = {}
): UseContactDrawingReturn => {
  const random = options.random ?? Math.random;

  const drawBackground = useCallback((): void => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Очистка с учетом того, что transform уже установлен в lifecycle
    ctx.clearRect(0, 0, rect.width, rect.height);

    const cols = Math.ceil(rect.width / pixelSize);
    const rows = Math.ceil(rect.height / pixelSize);

    // One gradient fill instead of per-cell base colors.
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, colors.primary[900]);
    gradient.addColorStop(0.5, colors.primary[800]);
    gradient.addColorStop(1, colors.primary[700]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cols * pixelSize, rows * pixelSize);

    // Cat hint cells only (sparse) — darker than the gradient base.
    ctx.fillStyle = colors.primary[950];
    catMapRef.current.forEach((_value, key) => {
      const [colRaw, rowRaw] = key.split(",");
      const col = Number(colRaw);
      const row = Number(rowRaw);
      if (!Number.isFinite(col) || !Number.isFinite(row)) return;
      ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
    });

    // Grid lines as row/col strokes (cheaper than strokeRect per cell).
    ctx.strokeStyle = `${colors.primary[600]}20`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let col = 0; col <= cols; col++) {
      const x = col * pixelSize;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rows * pixelSize);
    }
    for (let row = 0; row <= rows; row++) {
      const y = row * pixelSize;
      ctx.moveTo(0, y);
      ctx.lineTo(cols * pixelSize, y);
    }
    ctx.stroke();
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

      const pixelsToDraw = sampleBrushStroke(
        canvasX,
        canvasY,
        canvasPrevX,
        canvasPrevY,
        pixelSize,
        brushRadius
      );

      const newDrawn: Array<{ x: number; y: number }> = [];

      for (const [key, { x: px, y: py, intensity }] of pixelsToDraw) {
        const existing = revealedMapRef.current.get(key);
        if (existing !== undefined && existing.intensity >= intensity) continue;

        const catColor = catMapRef.current.get(key);

        let fillColor: string;

        if (existing !== undefined) {
          fillColor = existing.color;
        } else if (catColor !== undefined && catColor !== "") {
          fillColor = catColor;
        } else {
          // Яркий закрашенный след: светлые «искры» на ровном акцентном фоне,
          // чтобы тёмные силуэты котов читались контрастно.
          const variation = random();
          if (variation > 0.9) {
            fillColor = colors.accent[200];
          } else if (variation > 0.72) {
            fillColor = colors.accent[300];
          } else {
            fillColor = colors.accent[400];
          }
        }

        ctx.globalAlpha = intensity;
        ctx.fillStyle = fillColor;
        ctx.fillRect(px, py, pixelSize, pixelSize);
        revealedMapRef.current.set(key, { color: fillColor, intensity });
        newDrawn.push({ x: px, y: py });
      }

      ctx.globalAlpha = 1;

      ctx.strokeStyle = `${colors.primary[600]}15`;
      ctx.lineWidth = 0.5;
      for (const p of newDrawn) {
        ctx.strokeRect(p.x, p.y, pixelSize, pixelSize);
      }
    },
    [brushRadius, pixelSize, canvasRef, ctxRef, catMapRef, revealedMapRef, random]
  );

  return { drawBackground, drawOnCanvas };
};
