import { type RefObject, useCallback } from "react";

import { computeCoverage } from "@/shared/ui";

interface UseGridCoverageReturn {
  checkCoverage: (targetRect: DOMRect) => number;
}

export const useGridCoverage = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  paintedRef: RefObject<Map<string, string>>,
  pixelSize: number
): UseGridCoverageReturn => {
  const checkCoverage = useCallback(
    (targetRect: DOMRect): number => {
      const canvas = canvasRef.current;
      if (!canvas) return 0;
      const canvasRect = canvas.getBoundingClientRect();
      return computeCoverage(
        targetRect,
        canvasRect,
        (c, r) => paintedRef.current.has(`${String(c)},${String(r)}`),
        pixelSize
      );
    },
    [pixelSize, canvasRef, paintedRef]
  );

  return { checkCoverage };
};
