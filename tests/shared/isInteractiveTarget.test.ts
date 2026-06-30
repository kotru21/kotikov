import { describe, expect, it } from "vitest";

import { isInteractiveTarget } from "@/shared/lib/dom/isInteractiveTarget";

describe("isInteractiveTarget", () => {
  it("treats buttons with data-draw-allow as interactive", () => {
    document.body.innerHTML =
      '<button type="button" data-draw-allow><span id="icon">icon</span></button>';
    const icon = document.getElementById("icon");

    expect(isInteractiveTarget(icon)).toBe(true);
  });

  it("treats links with data-draw-allow as interactive", () => {
    document.body.innerHTML = '<a href="/" data-draw-allow>Home</a>';
    const link = document.querySelector("a");

    expect(isInteractiveTarget(link)).toBe(true);
  });

  it("allows paw drawing on decorative data-draw-allow elements", () => {
    document.body.innerHTML = '<div data-draw-allow><span id="line"></span></div>';
    const line = document.getElementById("line");

    expect(isInteractiveTarget(line)).toBe(false);
  });

  it("respects data-draw-exclude on non-native elements", () => {
    document.body.innerHTML = '<div data-draw-exclude><span id="target"></span></div>';
    const target = document.getElementById("target");

    expect(isInteractiveTarget(target)).toBe(true);
  });
});
