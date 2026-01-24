import { type RefObject, useCallback } from "react";

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
      const intersectionLeft = Math.max(targetRect.left, canvasRect.left);
      const intersectionTop = Math.max(targetRect.top, canvasRect.top);
      const intersectionRight = Math.min(targetRect.right, canvasRect.right);
      const intersectionBottom = Math.min(targetRect.bottom, canvasRect.bottom);

      if (intersectionLeft >= intersectionRight || intersectionTop >= intersectionBottom) return 0;

      const relativeLeft = intersectionLeft - canvasRect.left;
      const relativeTop = intersectionTop - canvasRect.top;
      const relativeRight = intersectionRight - canvasRect.left;
      const relativeBottom = intersectionBottom - canvasRect.top;

      const startCol = Math.floor(relativeLeft / pixelSize);
      const endCol = Math.floor(relativeRight / pixelSize);
      const startRow = Math.floor(relativeTop / pixelSize);
      const endRow = Math.floor(relativeBottom / pixelSize);

      let totalCells = 0;
      let paintedCells = 0;

      for (let c = startCol; c <= endCol; c++) {
        for (let r = startRow; r <= endRow; r++) {
          const cellX = c * pixelSize;
          const cellY = r * pixelSize;
          const overlapW = Math.max(
            0,
            Math.min(cellX + pixelSize, relativeRight) - Math.max(cellX, relativeLeft)
          );
          const overlapH = Math.max(
            0,
            Math.min(cellY + pixelSize, relativeBottom) - Math.max(cellY, relativeTop)
          );

          if (overlapW > 0 && overlapH > 0) {
            totalCells++;
            if (paintedRef.current.has(`${String(c)},${String(r)}`)) paintedCells++;
          }
        }
      }
      return totalCells === 0 ? 0 : paintedCells / totalCells;
    },
    [pixelSize, canvasRef, paintedRef]
  );

  return { checkCoverage };
};
