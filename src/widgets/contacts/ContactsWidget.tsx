"use client";

import React, { useCallback, useLayoutEffect, useRef } from "react";

import {
  InteractiveTextContext,
  useInteractiveCollision,
  useInteractiveRegistry,
} from "@/features/interactive-elements";
import { usePawAnimation } from "@/features/paw";
import { useSceneMotionPolicy } from "@/features/performance";
import { useTheme } from "@/features/theme/client";
import { contactsData } from "@/shared/config/content";

import { type ContactCanvasRef, ContactsView } from "./ui";

const ContactsWidget: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<ContactCanvasRef>(null);

  const motion = useSceneMotionPolicy(sectionRef, { dominantEffect: "paint" });
  // Mount canvas whenever paint is allowed by a11y settings — do NOT tie mount to
  // isInView/visibility, or the canvas remounts (and loses paint state) on every flip.
  const mountPaint = !motion.reducedMotion;
  const enablePaint = mountPaint && motion.isInView && motion.isDocumentVisible;
  const { isDark } = useTheme();

  const { registry, interactiveElementsRef } = useInteractiveRegistry();
  const { checkCollisions, resyncAll } = useInteractiveCollision(interactiveElementsRef);

  useLayoutEffect(() => {
    if (!enablePaint) return;
    resyncAll(canvasRef);
  }, [enablePaint, isDark, resyncAll]);

  const handleDraw = useCallback(
    (x: number, y: number, prevX: number, prevY: number) => {
      if (!enablePaint) return;
      canvasRef.current?.drawOnCanvas(x, y, prevX, prevY);
      checkCollisions(x, y, prevX, prevY, canvasRef);
    },
    [checkCollisions, enablePaint]
  );

  const {
    isDrawing,
    handlers: {
      handlePointerEnter,
      handlePointerMove,
      handlePointerLeave,
      handlePointerDown,
      handlePointerUp,
      handlePointerCancel,
    },
  } = usePawAnimation(handleDraw, { enabled: enablePaint });

  const handleClearCanvas = (): void => {
    if (!enablePaint) return;
    canvasRef.current?.clearDrawing();
    resyncAll(canvasRef);
  };

  return (
    <InteractiveTextContext value={registry}>
      <ContactsView
        sectionRef={sectionRef}
        contacts={contactsData}
        isDrawing={isDrawing}
        mountPaint={mountPaint}
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
