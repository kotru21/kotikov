import { useCallback } from "react";

import type { GridPaintOverlayRef } from "@/shared/ui";

export const useInteractiveCollision = (
  interactiveElementsRef: React.RefObject<Set<HTMLElement>>
) => {
  const checkCollisions = useCallback(
    (
      x: number,
      y: number,
      prevX: number,
      prevY: number,
      paintRef: React.RefObject<GridPaintOverlayRef | null>
    ) => {
      if (!paintRef.current) return;

      const paint = paintRef.current;
      const buffer = 60;
      const minX = Math.min(x, prevX) - buffer;
      const maxX = Math.max(x, prevX) + buffer;
      const minY = Math.min(y, prevY) - buffer;
      const maxY = Math.max(y, prevY) + buffer;

      interactiveElementsRef.current.forEach((el) => {
        
        const targetColor = el.dataset.interactiveColor || "black";
        
       
        const isSolid = el.dataset.interactiveMode === "solid";
        if (!isSolid && el.style.color === targetColor) return;
        
        const targetBg = el.dataset.interactiveBg || "black";
        if (isSolid && el.style.backgroundColor === targetBg) return;

        const rect = el.getBoundingClientRect();

        if (
          rect.right < minX ||
          rect.left > maxX ||
          rect.bottom < minY ||
          rect.top > maxY
        ) {
          return;
        }

        const coverage = paint.checkCoverage(rect);
        if (coverage > 0.3) {
          const mode = el.dataset.interactiveMode;

          if (mode === "solid") {
            el.style.backgroundColor = targetBg;
            el.style.borderColor = targetBg;
            el.style.color = el.dataset.interactiveText || "white";
            if (el.dataset.interactiveShadow) {
              el.style.boxShadow = el.dataset.interactiveShadow;
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
