import { type RefObject, useCallback } from "react";

import {
  computeContrastSample,
  computeCoverage,
  type ContrastSample,
} from "@/shared/lib";

interface UseGridCoverageReturn {
  checkCoverage: (targetRect: DOMRect) => number;
  sampleContrast: (targetRect: DOMRect) => ContrastSample;
}

export const useGridCoverage = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  paintedRef: RefObject<Map<string, { color: string; intensity: number }>>,
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

  const sampleContrast = useCallback(
    (targetRect: DOMRect): ContrastSample => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return { coverage: 0, luminance: null, preferDarkText: false };
      }
      const canvasRect = canvas.getBoundingClientRect();
      return computeContrastSample(
        targetRect,
        canvasRect,
        (c, r) => paintedRef.current.get(`${String(c)},${String(r)}`),
        pixelSize
      );
    },
    [pixelSize, canvasRef, paintedRef]
  );

  return { checkCoverage, sampleContrast };
};
