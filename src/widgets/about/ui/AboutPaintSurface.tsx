"use client";

import { type ReactNode, useCallback, useLayoutEffect, useRef } from "react";

import {
  InteractiveTextContext,
  type InteractiveTextRegistry,
  useInteractiveCollision,
  useInteractiveRegistry,
} from "@/features/interactive-elements/client";
import { usePawAnimation } from "@/features/paw/client";
import { useSceneMotionPolicy } from "@/features/performance/client";
import { useTheme } from "@/features/theme/client";
import { GridPaintOverlay, type GridPaintOverlayRef } from "@/shared/ui/GridPaintOverlay";

interface AboutPaintSurfaceProps {
  children: ReactNode;
}

interface AboutPaint {
  paintRef: React.RefObject<GridPaintOverlayRef | null>;
  mountPaint: boolean;
  registry: InteractiveTextRegistry;
  isDrawing: boolean;
  handlers: ReturnType<typeof usePawAnimation>["handlers"];
}

type PaintResync = ReturnType<typeof useInteractiveCollision>;

function usePaintThemeResync(
  enablePaint: boolean,
  paintRef: React.RefObject<GridPaintOverlayRef | null>,
  resyncAll: PaintResync["resyncAll"],
  clearAllContrast: PaintResync["clearAllContrast"]
): void {
  const { isDark } = useTheme();
  useLayoutEffect(() => {
    if (!enablePaint) {
      clearAllContrast();
      return;
    }
    resyncAll(paintRef);
  }, [enablePaint, isDark, paintRef, resyncAll, clearAllContrast]);
}

function useAboutPaint(aboutRef: React.RefObject<HTMLDivElement | null>): AboutPaint {
  const paintRef = useRef<GridPaintOverlayRef | null>(null);
  const motion = useSceneMotionPolicy(aboutRef, { dominantEffect: "paint" });
  const mountPaint = !motion.reducedMotion;
  const enablePaint = mountPaint && motion.isInView && motion.isDocumentVisible;
  const { registry, interactiveElementsRef } = useInteractiveRegistry();
  const { checkCollisions, resyncAll, clearAllContrast } =
    useInteractiveCollision(interactiveElementsRef);

  usePaintThemeResync(enablePaint, paintRef, resyncAll, clearAllContrast);

  const handleDraw = useCallback(
    (x: number, y: number, prevX: number, prevY: number) => {
      if (!enablePaint) return;
      paintRef.current?.drawOnCanvas(x, y, prevX, prevY);
      checkCollisions(x, y, prevX, prevY, paintRef);
    },
    [checkCollisions, enablePaint]
  );

  const paw = usePawAnimation(handleDraw, { enabled: enablePaint });
  return { paintRef, mountPaint, registry, ...paw };
}

function AboutPaintLayer({
  paintRef,
}: {
  paintRef: React.RefObject<GridPaintOverlayRef | null>;
}): React.JSX.Element {
  return (
    <GridPaintOverlay
      ref={paintRef}
      pixelSize={40}
      brushRadius={52}
      alpha={0.85}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full mix-blend-multiply dark:mix-blend-screen"
    />
  );
}

export function AboutPaintSurface({ children }: AboutPaintSurfaceProps): React.JSX.Element {
  const aboutRef = useRef<HTMLDivElement>(null);
  const { paintRef, mountPaint, registry, isDrawing, handlers } = useAboutPaint(aboutRef);

  return (
    <InteractiveTextContext value={registry}>
      <div
        ref={aboutRef}
        className="relative overflow-hidden"
        style={{ touchAction: isDrawing ? "none" : "pan-y" }}
        onPointerEnter={handlers.handlePointerEnter}
        onPointerMove={handlers.handlePointerMove}
        onPointerLeave={handlers.handlePointerLeave}
        onPointerDown={handlers.handlePointerDown}
        onPointerUp={handlers.handlePointerUp}
        onPointerCancel={handlers.handlePointerCancel}
      >
        {mountPaint ? <AboutPaintLayer paintRef={paintRef} /> : null}
        <div className="relative z-10">{children}</div>
      </div>
    </InteractiveTextContext>
  );
}
