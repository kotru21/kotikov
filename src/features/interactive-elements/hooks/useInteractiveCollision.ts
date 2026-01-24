import { useCallback } from "react";

import type { GridPaintOverlayRef } from "@/shared/ui";

interface CheckCollisionsResult {
  checkCollisions: (
    x: number,
    y: number,
    prevX: number,
    prevY: number,
    paintRef: React.RefObject<GridPaintOverlayRef | null>
  ) => void;
}

export const useInteractiveCollision = (
  interactiveElementsRef: React.RefObject<Set<HTMLElement>>
): CheckCollisionsResult => {
  const checkCollisions = useCallback(
    (
      x: number,
      y: number,
      prevX: number,
      prevY: number,
      paintRef: React.RefObject<GridPaintOverlayRef | null>
    ): void => {
      if (paintRef.current === null) return;

      const paint = paintRef.current;
      const buffer = 60;
      const minX = Math.min(x, prevX) - buffer;
      const maxX = Math.max(x, prevX) + buffer;
      const minY = Math.min(y, prevY) - buffer;
      const maxY = Math.max(y, prevY) + buffer;

      interactiveElementsRef.current.forEach((el) => {
        const targetColor = el.dataset.interactiveColor ?? "black";

        const isSolid = el.dataset.interactiveMode === "solid";
        if (!isSolid && el.style.color === targetColor) return;

        const targetBg = el.dataset.interactiveBg ?? "black";
        if (isSolid && el.style.backgroundColor === targetBg) return;

        const rect = el.getBoundingClientRect();

        if (rect.right < minX || rect.left > maxX || rect.bottom < minY || rect.top > maxY) {
          return;
        }

        const coverage = paint.checkCoverage(rect);
        if (coverage > 0.3) {
          const mode = el.dataset.interactiveMode;

          if (mode === "solid") {
            el.style.backgroundColor = targetBg;
            el.style.borderColor = targetBg;
            el.style.color = el.dataset.interactiveText ?? "white";
            const shadow = el.dataset.interactiveShadow;
            if (shadow !== undefined && shadow !== "") {
              el.style.boxShadow = shadow;
            }
          } else if (mode === "border") {
            el.style.borderColor = targetColor;
          } else {
            el.style.color = targetColor;
          }
        }
      });
    },
    [interactiveElementsRef]
  );

  return { checkCollisions };
};
