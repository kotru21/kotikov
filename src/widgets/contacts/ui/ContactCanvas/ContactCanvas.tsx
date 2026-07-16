"use client";

import React, { useImperativeHandle } from "react";

import {
  CONTACT_BRUSH_RADIUS,
  CONTACT_CANVAS_PIXEL_SIZE,
  CONTACTS_GRADIENT,
} from "../constants";
import { useContactCats } from "./hooks/useContactCats";
import { useContactDrawing } from "./hooks/useContactDrawing";
import { useContactLifecycle } from "./hooks/useContactLifecycle";
import { useContactPaintState } from "./hooks/useContactPaintState";

interface ContactCanvasProps {
  ref?: React.Ref<ContactCanvasRef>;
}

export interface ContactCanvasRef {
  drawOnCanvas: (x: number, y: number, prevX: number, prevY: number) => void;
  initCanvas: () => void;
  clearDrawing: () => void;
  checkCoverage: (rect: DOMRect) => number;
}

const ContactCanvas: React.FC<ContactCanvasProps> = ({ ref }) => {
  const pixelSize = CONTACT_CANVAS_PIXEL_SIZE;
  const brushRadius = CONTACT_BRUSH_RADIUS;

  const { catMapRef, generateCats } = useContactCats();
  const { revealedMapRef, clearPaint } = useContactPaintState();

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null);

  const { drawBackground, drawOnCanvas } = useContactDrawing(
    canvasRef,
    ctxRef,
    catMapRef,
    revealedMapRef,
    pixelSize,
    brushRadius
  );

  const { initCanvas, clearDrawing, checkCoverage } = useContactLifecycle(
    canvasRef,
    ctxRef,
    pixelSize,
    generateCats,
    drawBackground,
    revealedMapRef,
    clearPaint
  );

  useImperativeHandle(
    ref,
    () => ({
      drawOnCanvas,
      initCanvas,
      clearDrawing,
      checkCoverage,
    }),
    [drawOnCanvas, initCanvas, clearDrawing, checkCoverage]
  );

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{
        background: CONTACTS_GRADIENT,
        pointerEvents: "none",
      }}
    />
  );
};

export default ContactCanvas;
