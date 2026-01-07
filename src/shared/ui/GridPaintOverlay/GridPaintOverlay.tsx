"use client";

import React, { forwardRef, useImperativeHandle } from "react";

import { useGridCanvas } from "./hooks/useGridCanvas";
import { useGridCoverage } from "./hooks/useGridCoverage";
import { useGridPainting } from "./hooks/useGridPainting";

export interface GridPaintOverlayRef {
  drawOnCanvas: (x: number, y: number, prevX: number, prevY: number) => void;
  initCanvas: () => void;
  checkCoverage: (rect: DOMRect) => number;
}

interface GridPaintOverlayProps {
  pixelSize?: number;
  brushRadius?: number;
  alpha?: number;
  className?: string;
}

const GridPaintOverlay = forwardRef<GridPaintOverlayRef, GridPaintOverlayProps>(
  ({ pixelSize = 14, brushRadius = 22, alpha = 0.95, className }, ref) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null);

    // 1. Painting Logic (owns the painted data)
    const { paintedRef, drawOnCanvas } = useGridPainting(
      canvasRef,
      ctxRef,
      pixelSize,
      brushRadius,
      alpha
    );

    // 2. Canvas Lifecycle (redraws using painted data)
    const { initCanvas } = useGridCanvas(
      canvasRef,
      ctxRef,
      alpha,
      pixelSize,
      paintedRef
    );

    // 3. Coverage Logic
    const { checkCoverage } = useGridCoverage(canvasRef, paintedRef, pixelSize);

    useImperativeHandle(
      ref,
      () => ({
        drawOnCanvas,
        initCanvas,
        checkCoverage,
      }),
      [drawOnCanvas, initCanvas, checkCoverage]
    );

    return (
      <canvas
        ref={canvasRef}
        className={
          className ??
          "absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply dark:mix-blend-screen"
        }
        style={{ pointerEvents: "none" }}
      />
    );
  }
);

GridPaintOverlay.displayName = "GridPaintOverlay";
export default GridPaintOverlay;
