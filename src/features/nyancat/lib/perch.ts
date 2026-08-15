export interface PerchBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface SitTarget {
  x: number;
  y: number;
  perched: boolean;
}

/** Allow a perch when the pointer is just above the top border. */
export const PERCH_TOP_SLOP = 12;

export function clamp(value: number, min: number, max: number): number {
  if (max < min) return (min + max) / 2;
  return Math.min(max, Math.max(min, value));
}

export function isPointerOnPerch(
  box: PerchBox,
  pointerX: number,
  pointerY: number,
  topSlop = PERCH_TOP_SLOP
): boolean {
  return (
    pointerX >= box.left &&
    pointerX <= box.right &&
    pointerY >= box.top - topSlop &&
    pointerY <= box.bottom
  );
}

export function findPerchAtPointer(
  boxes: readonly PerchBox[],
  pointerX: number,
  pointerY: number,
  topSlop = PERCH_TOP_SLOP
): PerchBox | null {
  for (const box of boxes) {
    if (isPointerOnPerch(box, pointerX, pointerY, topSlop)) {
      return box;
    }
  }
  return null;
}

export function perchSitTarget(box: PerchBox, pointerX: number, catWidth: number): SitTarget {
  const half = catWidth / 2;
  return {
    x: clamp(pointerX, box.left + half, box.right - half),
    y: box.top,
    perched: true,
  };
}

export function elementToPerchBox(element: HTMLElement, container: HTMLElement): PerchBox {
  const origin = container.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left - origin.left,
    top: rect.top - origin.top,
    right: rect.right - origin.left,
    bottom: rect.bottom - origin.top,
  };
}

export function collectPerchBoxes(container: HTMLElement): PerchBox[] {
  const boxes: PerchBox[] = [];
  for (const node of container.querySelectorAll("[data-nyancat-perch]")) {
    if (node instanceof HTMLElement) {
      boxes.push(elementToPerchBox(node, container));
    }
  }
  return boxes;
}

export function resolveNyancatTarget(
  container: HTMLElement,
  pointer: { x: number; y: number },
  catWidth: number
): SitTarget {
  const perch = findPerchAtPointer(collectPerchBoxes(container), pointer.x, pointer.y);
  if (perch === null) {
    return { x: pointer.x, y: pointer.y, perched: false };
  }
  return perchSitTarget(perch, pointer.x, catWidth);
}

export function spriteTranslate3d(
  pos: { x: number; y: number },
  cat: { width: number; height: number },
  perched: boolean
): string {
  const x = pos.x - cat.width / 2;
  const y = perched ? pos.y - cat.height : pos.y - cat.width / 2;
  return `translate3d(${String(x)}px, ${String(y)}px, 0)`;
}
