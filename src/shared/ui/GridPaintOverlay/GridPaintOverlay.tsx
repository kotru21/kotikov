"use client";

import { type Ref, useImperativeHandle, useRef } from "react";

import type { ContrastSample } from "@/shared/lib";

import { useGridCanvas } from "./hooks/useGridCanvas";
import { useGridCoverage } from "./hooks/useGridCoverage";
import { useGridPainting } from "./hooks/useGridPainting";

export interface GridPaintOverlayRef {
  drawOnCanvas: (x: number, y: number, prevX: number, prevY: number) => void;
  initCanvas: () => void;
  checkCoverage: (rect: DOMRect) => number;
  sampleContrast: (rect: DOMRect) => ContrastSample;
}

interface GridPaintOverlayProps {
  pixelSize?: number;
  brushRadius?: number;
  alpha?: number;
  className?: string;
  ref?: Ref<GridPaintOverlayRef>;
}

export function GridPaintOverlay({
  pixelSize = 14,
  brushRadius = 22,
  alpha = 0.95,
  className,
  ref,
}: GridPaintOverlayProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // 1. Painting Logic (owns the painted data)
  const { paintedRef, drawOnCanvas } = useGridPainting(
    canvasRef,
    ctxRef,
    pixelSize,
    brushRadius,
    alpha
  );

  // 2. Canvas Lifecycle (redraws using painted data)
  const { initCanvas } = useGridCanvas(canvasRef, ctxRef, alpha, pixelSize, paintedRef);

  // 3. Coverage Logic
  const { checkCoverage, sampleContrast } = useGridCoverage(canvasRef, paintedRef, pixelSize);

  useImperativeHandle(
    ref,
    () => ({
      drawOnCanvas,
      initCanvas,
      checkCoverage,
      sampleContrast,
    }),
    [drawOnCanvas, initCanvas, checkCoverage, sampleContrast]
  );

  return (
    <canvas
      ref={canvasRef}
      className={
        className ??
        "pointer-events-none absolute inset-0 h-full w-full mix-blend-multiply dark:mix-blend-screen"
      }
      style={{ pointerEvents: "none" }}
    />
  );
}

export default GridPaintOverlay;
