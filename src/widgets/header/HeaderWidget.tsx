"use client";

import React, { useCallback, useRef } from "react";

import {
  InteractiveTextContext,
  useInteractiveCollision,
  useInteractiveRegistry,
} from "@/features/interactive-elements";
import { usePawAnimation } from "@/features/paw";
import { headerContent, navigation } from "@/shared/config/content";
import type { GridPaintOverlayRef } from "@/shared/ui";

import { HeaderBackground, HeaderHero, HeaderNavigation, HeaderNyancat } from "./ui";

const HeaderWidget: React.FC = () => {
  const paintRef = useRef<GridPaintOverlayRef | null>(null);

  const { registry, interactiveElementsRef } = useInteractiveRegistry();
  const { checkCollisions } = useInteractiveCollision(interactiveElementsRef);

  const handleDraw = useCallback(
    (x: number, y: number, prevX: number, prevY: number) => {
      paintRef.current?.drawOnCanvas(x, y, prevX, prevY);
      checkCollisions(x, y, prevX, prevY, paintRef);
    },
    [checkCollisions]
  );

  const {
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
      id="header"
      className="bg-background-primary dark:bg-background-tertiary relative flex min-h-screen flex-col overflow-hidden transition-colors duration-300"
      style={{ touchAction: "pan-y" }}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {/* Canvas now covers entire header (nav + hero) */}
      <HeaderBackground paintRef={paintRef} />

      <HeaderNyancat />

      <InteractiveTextContext value={registry}>
        <HeaderNavigation navigation={navigation} />

        <div className="relative isolate flex grow items-center justify-center px-6 pt-24 lg:px-8">
          <HeaderHero
            title={headerContent.title}
            subtitle={headerContent.subtitle}
            announcement={headerContent.announcement}
            buttons={headerContent.buttons}
          />
        </div>
      </InteractiveTextContext>
    </div>
  );
};

export default HeaderWidget;
