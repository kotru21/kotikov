import { describe, expect, it } from "vitest";

import {
  clamp,
  collectPerchBoxes,
  findPerchAtPointer,
  isPointerOnPerch,
  PERCH_TOP_SLOP,
  perchSitTarget,
  resolveNyancatTarget,
  spriteTranslate3d,
} from "@/features/nyancat";

const BOX = { left: 100, top: 40, right: 300, bottom: 180 };

function stubRect(node: HTMLElement, box: { left: number; top: number; width: number; height: number }): void {
  node.getBoundingClientRect = (): DOMRect => ({
    left: box.left,
    top: box.top,
    width: box.width,
    height: box.height,
    right: box.left + box.width,
    bottom: box.top + box.height,
    x: box.left,
    y: box.top,
    toJSON: () => ({}),
  });
}

describe("clamp", () => {
  it("clamps to the range and midpoints inverted ranges", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(20, 0, 10)).toBe(10);
    expect(clamp(3, 8, 2)).toBe(5);
  });
});

describe("perch hit testing", () => {
  it("treats the interior and a sliver above the top edge as on-perch", () => {
    expect(isPointerOnPerch(BOX, 150, 80)).toBe(true);
    expect(isPointerOnPerch(BOX, 150, BOX.top - PERCH_TOP_SLOP)).toBe(true);
    expect(isPointerOnPerch(BOX, 150, BOX.top - PERCH_TOP_SLOP - 1)).toBe(false);
    expect(isPointerOnPerch(BOX, 99, 80)).toBe(false);
  });

  it("returns the first matching perch box", () => {
    const ticker = { left: 0, top: 0, right: 400, bottom: 30 };
    expect(findPerchAtPointer([ticker, BOX], 150, 80)).toEqual(BOX);
    expect(findPerchAtPointer([ticker, BOX], 150, 10)).toEqual(ticker);
    expect(findPerchAtPointer([ticker, BOX], 10, 80)).toBeNull();
  });
});

describe("perchSitTarget", () => {
  it("sits on the top border and clamps X to the ledge", () => {
    expect(perchSitTarget(BOX, 200, 50)).toEqual({ x: 200, y: 40, perched: true });
    expect(perchSitTarget(BOX, 0, 50).x).toBe(125);
    expect(perchSitTarget(BOX, 999, 50).x).toBe(275);
  });
});

describe("collectPerchBoxes / resolveNyancatTarget", () => {
  it("maps [data-nyancat-perch] descendants into container space", () => {
    const container = document.createElement("div");
    const perch = document.createElement("article");
    perch.setAttribute("data-nyancat-perch", "");
    container.appendChild(perch);
    stubRect(container, { left: 10, top: 20, width: 400, height: 300 });
    stubRect(perch, { left: 110, top: 60, width: 200, height: 140 });

    expect(collectPerchBoxes(container)).toEqual([
      { left: 100, top: 40, right: 300, bottom: 180 },
    ]);

    expect(resolveNyancatTarget(container, { x: 200, y: 80 }, 50)).toEqual({
      x: 200,
      y: 40,
      perched: true,
    });
    expect(resolveNyancatTarget(container, { x: 10, y: 80 }, 50).perched).toBe(false);
  });
});

describe("spriteTranslate3d", () => {
  it("puts feet on the perch line and centers the free-follow sprite", () => {
    const cat = { width: 50, height: 33 };
    expect(spriteTranslate3d({ x: 200, y: 40 }, cat, true)).toBe("translate3d(175px, 7px, 0)");
    expect(spriteTranslate3d({ x: 200, y: 40 }, cat, false)).toBe("translate3d(175px, 15px, 0)");
  });
});
