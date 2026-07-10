"use client";

import React, { useCallback, useRef } from "react";

import {
  InteractiveTextContext,
  useInteractiveCollision,
  useInteractiveRegistry,
} from "@/features/interactive-elements";
import { usePawAnimation } from "@/features/paw";
import { usePerformanceSettings, useSceneMotionPolicy } from "@/features/performance";
import { headerContent, navigation } from "@/shared/config/content";
import type { GridPaintOverlayRef } from "@/shared/ui";

import { HeaderBackground, HeaderHero, HeaderNavigation, HeaderNyancat } from "./ui";

const HeaderWidget: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const paintRef = useRef<GridPaintOverlayRef | null>(null);

  const { reducedMotion, lowPerformance } = usePerformanceSettings();
  const enablePaint = !reducedMotion;
  const showDecorations = enablePaint && !lowPerformance;
  const motion = useSceneMotionPolicy(headerRef, {
    dominantEffect: showDecorations ? "flying-nyancat" : "paint",
  });

  const { registry, interactiveElementsRef } = useInteractiveRegistry();
  const { checkCollisions } = useInteractiveCollision(interactiveElementsRef);

  const handleDraw = useCallback(
    (x: number, y: number, prevX: number, prevY: number) => {
      if (!enablePaint) return;
      paintRef.current?.drawOnCanvas(x, y, prevX, prevY);
      checkCollisions(x, y, prevX, prevY, paintRef);
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
  } = usePawAnimation(handleDraw);

  return (
    <div
      ref={headerRef}
      id="header"
      className="bg-background-primary dark:bg-background-tertiary relative flex min-h-screen flex-col overflow-hidden transition-colors duration-300"
      style={{
        touchAction: isDrawing ? "none" : "pan-y",
        cursor: isDrawing ? "none" : undefined,
      }}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <HeaderBackground paintRef={enablePaint ? paintRef : undefined} />

      {showDecorations ? <HeaderNyancat isMotionActive={motion.canRunContinuous} /> : null}

      <InteractiveTextContext value={registry}>
        <HeaderNavigation navigation={navigation} />

        <div
          id="main-content"
          className="relative isolate flex w-full grow items-center justify-center px-4 pt-20 pb-10 sm:px-6 sm:pt-24 sm:pb-12 md:px-8"
          tabIndex={-1}
        >
          {enablePaint ? (
            <p className="sr-only">
              На фоне можно оставить след лапы, проводя мышью или удерживая палец.
            </p>
          ) : null}
          <HeaderHero
            eyebrow={headerContent.eyebrow}
            title={headerContent.title}
            subtitle={headerContent.subtitle}
            buttons={headerContent.buttons}
          />
        </div>
      </InteractiveTextContext>
    </div>
  );
};

export default HeaderWidget;
