import type { RefObject } from "react";
import { useCallback, useEffect } from "react";

export const useContactLifecycle = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  ctxRef: RefObject<CanvasRenderingContext2D | null>,
  onInitCanvas: () => void,
  pixelSize: number,
  generateCats: (rows: number, cols: number) => void,
  drawBackground: () => void
) => {
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctxRef.current = ctx;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    // Reset transform before resize to avoid compounding
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.imageSmoothingEnabled = false;
    ctx.globalCompositeOperation = "source-over";

    const cols = Math.ceil(rect.width / pixelSize);
    const rows = Math.ceil(rect.height / pixelSize);

    generateCats(rows, cols);
    drawBackground();
    onInitCanvas();
  }, [onInitCanvas, generateCats, drawBackground, pixelSize, canvasRef, ctxRef]);

  useEffect(() => {
    initCanvas();
    const handleResize = () => {
      setTimeout(initCanvas, 100);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [initCanvas]);

  return { canvasRef, ctxRef, initCanvas };
};
