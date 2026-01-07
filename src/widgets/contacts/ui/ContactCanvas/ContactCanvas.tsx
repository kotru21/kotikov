"use client";

import React, { forwardRef, useImperativeHandle } from "react";

import { colors } from "@/styles/colors";

import { CONTACT_CANVAS_PIXEL_SIZE } from "../constants";
import { useContactCats } from "./hooks/useContactCats";
import { useContactDrawing } from "./hooks/useContactDrawing";
import { useContactLifecycle } from "./hooks/useContactLifecycle";

interface ContactCanvasProps {
  onInitCanvas: () => void;
}

export interface ContactCanvasRef {
  drawOnCanvas: (x: number, y: number, prevX: number, prevY: number) => void;
  initCanvas: () => void;
}

const ContactCanvas = forwardRef<ContactCanvasRef, ContactCanvasProps>(
  ({ onInitCanvas }, ref) => {
    const pixelSize = CONTACT_CANVAS_PIXEL_SIZE;
    const brushRadius = 20;

    // 1. Cat Logic (Data)
    const { catMapRef, revealedPixelsRef, generateCats } = useContactCats();

    // 2. Lifecycle & Refs base
    // Note: useContactLifecycle creates refs, but useContactDrawing needs them.
    // So we should probably lift refs here or pass them.
    // Let's create `canvasRef` here like we did for GridPaintOverlay.
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null);

    // 3. Drawing Logic receives refs
    const { drawBackground, drawOnCanvas } = useContactDrawing(
      canvasRef,
      ctxRef,
      catMapRef,
      revealedPixelsRef,
      pixelSize,
      brushRadius
    );

    // 4. Lifecycle uses drawing callbacks
    const { initCanvas } = useContactLifecycle(
      canvasRef,
      ctxRef,
      onInitCanvas,
      pixelSize,
      generateCats,
      drawBackground
    );

    // Fix: pass refs to lifecycle or sync them?
    // In useContactLifecycle I created refs internally. I should change it to use passed refs
    // for consistency with GridPaintOverlay refactor. See patch below.
    
    // patching useContactLifecycle on the fly via "overriding" with the refs created here?
    // No, I need to edit useContactLifecycle.ts to accept refs. 
    // Wait, let's look at `useContactLifecycle.ts` I just created.
    // It creates: `const canvasRef = useRef<HTMLCanvasElement>(null);` inside.
    
    // I will rewrite this component to assume `useContactLifecycle` is updated or I will update it.
    // Since I cannot update it in the same turn easily without confusion, I will overwrite it in the next step.
    // For now I will assume `useContactLifecycle` accepts `canvasRef` and `ctxRef`.
    
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
  }
);

ContactCanvas.displayName = "ContactCanvas";
export default ContactCanvas;
