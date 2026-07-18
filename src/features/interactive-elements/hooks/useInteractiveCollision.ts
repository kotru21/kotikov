import { useCallback } from "react";

import type { ContrastSample } from "@/shared/lib";

import { applyPaintContrast } from "../lib/applyPaintContrast";

interface CheckCollisionsResult {
  checkCollisions: (
    x: number,
    y: number,
    prevX: number,
    prevY: number,
    paintRef: React.RefObject<PaintContrastSurface | null>
  ) => void;
  resyncAll: (paintRef: React.RefObject<PaintContrastSurface | null>) => void;
}

export interface PaintContrastSurface {
  checkCoverage?: (rect: DOMRect) => number;
  sampleContrast: (rect: DOMRect) => ContrastSample;
}

export const DEFAULT_PAINT_COVERAGE_THRESHOLD = 0.7;

const COLLISION_BUFFER = 60;

export const useInteractiveCollision = (
  interactiveElementsRef: React.RefObject<Set<HTMLElement>>,
  coverageThreshold = DEFAULT_PAINT_COVERAGE_THRESHOLD
): CheckCollisionsResult => {
  const syncElementContrast = useCallback(
    (el: HTMLElement, paint: PaintContrastSurface, rect = el.getBoundingClientRect()): void => {
      applyPaintContrast(el, paint.sampleContrast(rect), coverageThreshold);
    },
    [coverageThreshold]
  );

  const checkCollisions = useCallback(
    (
      x: number,
      y: number,
      prevX: number,
      prevY: number,
      paintRef: React.RefObject<PaintContrastSurface | null>
    ): void => {
      const paint = paintRef.current;
      if (paint === null) return;

      const minX = Math.min(x, prevX) - COLLISION_BUFFER;
      const maxX = Math.max(x, prevX) + COLLISION_BUFFER;
      const minY = Math.min(y, prevY) - COLLISION_BUFFER;
      const maxY = Math.max(y, prevY) + COLLISION_BUFFER;

      interactiveElementsRef.current.forEach((el) => {
        if (el.dataset.drawExclude !== undefined) return;

        const rect = el.getBoundingClientRect();
        if (rect.right < minX || rect.left > maxX || rect.bottom < minY || rect.top > maxY) {
          return;
        }

        syncElementContrast(el, paint, rect);
      });
    },
    [interactiveElementsRef, syncElementContrast]
  );

  const resyncAll = useCallback(
    (paintRef: React.RefObject<PaintContrastSurface | null>): void => {
      const paint = paintRef.current;
      if (paint === null) return;

      interactiveElementsRef.current.forEach((el) => {
        if (el.dataset.drawExclude !== undefined) return;
        syncElementContrast(el, paint);
      });
    },
    [interactiveElementsRef, syncElementContrast]
  );

  return { checkCollisions, resyncAll };
};
