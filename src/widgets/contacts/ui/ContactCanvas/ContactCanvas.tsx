"use client";

import React, { useImperativeHandle } from "react";

import { colors } from "@/styles/colors";

import { CONTACT_CANVAS_PIXEL_SIZE } from "../constants";
import { useContactCats } from "./hooks/useContactCats";
import { useContactDrawing } from "./hooks/useContactDrawing";
import { useContactLifecycle } from "./hooks/useContactLifecycle";

interface ContactCanvasProps {
  onInitCanvas: () => void;
  ref?: React.Ref<ContactCanvasRef>;
}

export interface ContactCanvasRef {
  drawOnCanvas: (x: number, y: number, prevX: number, prevY: number) => void;
  initCanvas: () => void;
}

const ContactCanvas: React.FC<ContactCanvasProps> = ({ onInitCanvas, ref }) => {
    const pixelSize = CONTACT_CANVAS_PIXEL_SIZE;
    const brushRadius = 20;


    const { catMapRef, revealedPixelsRef, generateCats } = useContactCats();

    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null);

    const { drawBackground, drawOnCanvas } = useContactDrawing(
      canvasRef,
      ctxRef,
      catMapRef,
      revealedPixelsRef,
      pixelSize,
      brushRadius
    );

    const { initCanvas } = useContactLifecycle(
      canvasRef,
      ctxRef,
      onInitCanvas,
      pixelSize,
      generateCats,
      drawBackground
    );

    useImperativeHandle(
      ref,
      () => ({
        drawOnCanvas,
        initCanvas,
      }),
      [drawOnCanvas, initCanvas]
    );

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: `linear-gradient(135deg, ${colors.primary[900]}, ${colors.primary[800]} 50%, ${colors.primary[700]})`,
          pointerEvents: "none",
        }}
      />
    );
};

export default ContactCanvas;
