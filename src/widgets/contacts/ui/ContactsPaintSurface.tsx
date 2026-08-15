"use client";

import { type ReactNode, useCallback, useLayoutEffect, useRef } from "react";

import {
  InteractiveTextContext,
  useInteractiveCollision,
  useInteractiveRegistry,
} from "@/features/interactive-elements/client";
import { usePawAnimation } from "@/features/paw/client";
import { useSceneMotionPolicy } from "@/features/performance/client";
import { useTheme } from "@/features/theme/client";

import type { ContactCanvasRef } from "./ContactCanvas";
import ContactsView from "./ContactsView";

interface ContactsPaintSurfaceProps {
  children: ReactNode;
}

export function ContactsPaintSurface({ children }: ContactsPaintSurfaceProps): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<ContactCanvasRef>(null);
  const motion = useSceneMotionPolicy(sectionRef, { dominantEffect: "paint" });
  const mountPaint = !motion.reducedMotion;
  const enablePaint = mountPaint && motion.isInView && motion.isDocumentVisible;
  const { isDark } = useTheme();
  const { registry, interactiveElementsRef } = useInteractiveRegistry();
  const { checkCollisions, resyncAll, clearAllContrast } =
    useInteractiveCollision(interactiveElementsRef);

  useLayoutEffect(() => {
    if (!enablePaint) {
      clearAllContrast();
      return;
    }
    resyncAll(canvasRef);
  }, [enablePaint, isDark, resyncAll, clearAllContrast]);

  const handleDraw = useCallback(
    (x: number, y: number, prevX: number, prevY: number) => {
      if (!enablePaint) return;
      canvasRef.current?.drawOnCanvas(x, y, prevX, prevY);
      checkCollisions(x, y, prevX, prevY, canvasRef);
    },
    [checkCollisions, enablePaint]
  );

  const paw = usePawAnimation(handleDraw, { enabled: enablePaint });

  const handleClearCanvas = (): void => {
    if (!enablePaint) return;
    canvasRef.current?.clearDrawing();
    resyncAll(canvasRef);
  };

  return (
    <InteractiveTextContext value={registry}>
      <ContactsView
        sectionRef={sectionRef}
        isDrawing={paw.isDrawing}
        mountPaint={mountPaint}
        enablePaint={enablePaint}
        onClearCanvas={handleClearCanvas}
        canvasRef={canvasRef}
        onPointerEnter={paw.handlers.handlePointerEnter}
        onPointerMove={paw.handlers.handlePointerMove}
        onPointerLeave={paw.handlers.handlePointerLeave}
        onPointerDown={paw.handlers.handlePointerDown}
        onPointerUp={paw.handlers.handlePointerUp}
        onPointerCancel={paw.handlers.handlePointerCancel}
      >
        {children}
      </ContactsView>
    </InteractiveTextContext>
  );
}
