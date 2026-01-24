import { useCallback } from "react";

interface CheckCollisionsResult {
  checkCollisions: (
    x: number,
    y: number,
    prevX: number,
    prevY: number,
    paintRef: React.RefObject<{ checkCoverage: (rect: DOMRect) => number } | null>
  ) => void;
}

export const useInteractiveCollision = (
  interactiveElementsRef: React.RefObject<Set<HTMLElement>>,
  coverageThreshold = 0.3
): CheckCollisionsResult => {
  const checkCollisions = useCallback(
    (
      x: number,
      y: number,
      prevX: number,
      prevY: number,
      paintRef: React.RefObject<{ checkCoverage: (rect: DOMRect) => number } | null>
    ): void => {
      if (paintRef.current === null) return;

      const paint = paintRef.current;
      const buffer = 60;
      const minX = Math.min(x, prevX) - buffer;
      const maxX = Math.max(x, prevX) + buffer;
      const minY = Math.min(y, prevY) - buffer;
      const maxY = Math.max(y, prevY) + buffer;

      interactiveElementsRef.current.forEach((el) => {
        // Skip elements that explicitly opt-out of paint reactions (e.g., mobile menu items)
        if (el.dataset.drawExclude !== undefined) return;

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
        const elementThreshold =
          el.dataset.interactiveThreshold !== undefined
            ? Number(el.dataset.interactiveThreshold)
            : coverageThreshold;
        if (coverage > elementThreshold) {
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
    [interactiveElementsRef, coverageThreshold]
  );

  return { checkCollisions };
};
