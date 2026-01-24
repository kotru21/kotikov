import { type RefObject, useCallback } from "react";

import { computeCoverage,useCanvasLifecycle } from "@/shared/ui";
import { colors } from "@/styles/colors";

interface UseContactLifecycleReturn {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  ctxRef: RefObject<CanvasRenderingContext2D | null>;
  initCanvas: () => void;
  checkCoverage: (rect: DOMRect) => number;
}

export const useContactLifecycle = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  ctxRef: RefObject<CanvasRenderingContext2D | null>,
  onInitCanvas: () => void,
  pixelSize: number,
  generateCats: (rows: number, cols: number) => void,
  drawBackground: () => void,
  revealedMapRef: RefObject<Map<string, string>>
): UseContactLifecycleReturn => {
  const initCanvas = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctxRef.current = ctx;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);

    // Reset transform before resize to avoid compounding
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.scale(dpr, dpr);

    ctx.imageSmoothingEnabled = false;
    ctx.globalCompositeOperation = "source-over";

    const cols = Math.ceil(rect.width / pixelSize);
    const rows = Math.ceil(rect.height / pixelSize);

    // Prune revealed pixels that are outside the new bounds
    for (const key of revealedMapRef.current.keys()) {
      const [c, r] = key.split(",").map(Number);
      if (c < 0 || r < 0 || c >= cols || r >= rows) {
        revealedMapRef.current.delete(key);
      }
    }

    generateCats(rows, cols);
    drawBackground();

    // Repaint revealed pixels (preserve colors)
    for (const [key, color] of revealedMapRef.current) {
      const [c, r] = key.split(",").map(Number);
      ctx.fillStyle = color;
      ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
    }

    ctx.strokeStyle = `${colors.primary[600]}15`;
    ctx.lineWidth = 0.5;
    for (const [key] of revealedMapRef.current) {
      const [c, r] = key.split(",").map(Number);
      ctx.strokeRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
    }

    onInitCanvas();
  }, [onInitCanvas, generateCats, drawBackground, pixelSize, canvasRef, ctxRef, revealedMapRef]);

  useCanvasLifecycle(initCanvas);

  const checkCoverage = useCallback(
    (targetRect: DOMRect): number => {
      const canvas = canvasRef.current;
      if (!canvas) return 0;
      const canvasRect = canvas.getBoundingClientRect();
      return computeCoverage(
        targetRect,
        canvasRect,
        (c, r) => revealedMapRef.current.has(`${String(c)},${String(r)}`),
        pixelSize
      );
    },
    [pixelSize, canvasRef, revealedMapRef]
  );

  return { canvasRef, ctxRef, initCanvas, checkCoverage };
};
