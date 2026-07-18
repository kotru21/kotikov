import { preferDarkTextFromLuminance, relativeLuminanceFromCssColor } from "./relativeLuminance";

export interface ContrastSample {
  coverage: number;
  luminance: number | null;
  preferDarkText: boolean;
}

export function computeContrastSample(
  targetRect: DOMRect,
  canvasRect: DOMRect,
  getCell: (col: number, row: number) => { color: string } | undefined,
  pixelSize: number
): ContrastSample {
  const intersectionLeft = Math.max(targetRect.left, canvasRect.left);
  const intersectionTop = Math.max(targetRect.top, canvasRect.top);
  const intersectionRight = Math.min(targetRect.right, canvasRect.right);
  const intersectionBottom = Math.min(targetRect.bottom, canvasRect.bottom);

  if (intersectionLeft >= intersectionRight || intersectionTop >= intersectionBottom) {
    return { coverage: 0, luminance: null, preferDarkText: false };
  }

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
  let luminanceSum = 0;
  let validLuminanceCount = 0;

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
        const entry = getCell(c, r);
        if (entry !== undefined) {
          paintedCells++;
          const luminance = relativeLuminanceFromCssColor(entry.color);
          if (luminance !== null) {
            luminanceSum += luminance;
            validLuminanceCount++;
          }
        }
      }
    }
  }

  const coverage = totalCells === 0 ? 0 : paintedCells / totalCells;
  const luminance =
    validLuminanceCount === 0 ? null : luminanceSum / validLuminanceCount;

  return {
    coverage,
    luminance,
    preferDarkText: luminance === null ? false : preferDarkTextFromLuminance(luminance),
  };
}
