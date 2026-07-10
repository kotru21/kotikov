"use client";

import React, { useCallback, useRef } from "react";

import {
  InteractiveTextContext,
  useInteractiveCollision,
  useInteractiveRegistry,
} from "@/features/interactive-elements";
import { usePawAnimation } from "@/features/paw";
import { useSceneMotionPolicy } from "@/features/performance";
import { contactsData } from "@/shared/config/content";

import { type ContactCanvasRef, ContactsView } from "./ui";

const ContactsWidget: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<ContactCanvasRef>(null);

  const motion = useSceneMotionPolicy(sectionRef, { dominantEffect: "paint" });
  const enablePaint = !motion.reducedMotion && motion.isInView && motion.isDocumentVisible;
  const showPaw = enablePaint && !motion.lowPerformance;

  const { registry, interactiveElementsRef } = useInteractiveRegistry();
  const { checkCollisions } = useInteractiveCollision(interactiveElementsRef);

  const handleDraw = useCallback(
    (x: number, y: number, prevX: number, prevY: number) => {
      if (!enablePaint) return;
      canvasRef.current?.drawOnCanvas(x, y, prevX, prevY);
      checkCollisions(x, y, prevX, prevY, canvasRef);
    },
    [checkCollisions, enablePaint]
  );

  const {
    pawPos,
    pawVelocity,
    isDrawing,
    handlers: {
      handlePointerEnter,
      handlePointerMove,
      handlePointerLeave,
      handlePointerDown,
      handlePointerUp,
      handlePointerCancel,
    },
  } = usePawAnimation(handleDraw);

  const handleClearCanvas = (): void => {
    if (!enablePaint) return;
    canvasRef.current?.initCanvas();
  };

  return (
    <InteractiveTextContext value={registry}>
      <ContactsView
        sectionRef={sectionRef}
        contacts={contactsData}
        pawPos={pawPos}
        pawVelocity={pawVelocity}
        isDrawing={isDrawing}
        showPaw={showPaw}
        enablePaint={enablePaint}
        onClearCanvas={handleClearCanvas}
        canvasRef={canvasRef}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      />
    </InteractiveTextContext>
  );
};

export default ContactsWidget;
