import { useCallback } from "react";

import type { GridPaintOverlayRef } from "@/shared/ui";

export const useInteractiveCollision = (
  interactiveElementsRef: React.MutableRefObject<Set<HTMLElement>>
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
        // Оптимизация: если уже закрашен (черный), пропускаем
        if (el.style.color === "black" && el.dataset.interactiveMode !== "solid") return;
        if (
          el.style.backgroundColor === "black" &&
          el.dataset.interactiveMode === "solid"
        )
          return;

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
            el.style.backgroundColor = "black";
            el.style.borderColor = "black";
            el.style.color = "white";
          } else if (mode === "border") {
            el.style.borderColor = "black";
          } else {
            el.style.color = "black";
          }
        }
      });
    },
    [interactiveElementsRef]
  );

  return { checkCollisions };
};
