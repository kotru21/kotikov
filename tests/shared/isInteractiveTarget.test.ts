import { describe, expect, it } from "vitest";

import { isInteractiveTarget } from "@/shared/lib/dom/isInteractiveTarget";

describe("isInteractiveTarget", () => {
  it("allows paw drawing on buttons with data-draw-allow", () => {
    document.body.innerHTML =
      '<button type="button" data-draw-allow><span id="icon">icon</span></button>';
    const icon = document.getElementById("icon");

    expect(isInteractiveTarget(icon)).toBe(false);
  });

  it("allows paw drawing on links with data-draw-allow", () => {
    document.body.innerHTML = '<a href="/" data-draw-allow>Home</a>';
    const link = document.querySelector("a");

    expect(isInteractiveTarget(link)).toBe(false);
  });

  it("allows paw drawing on decorative data-draw-allow elements", () => {
    document.body.innerHTML = '<div data-draw-allow><span id="line"></span></div>';
    const line = document.getElementById("line");

    expect(isInteractiveTarget(line)).toBe(false);
  });

  it("blocks drawing on native interactive elements without draw-allow", () => {
    document.body.innerHTML = '<button type="button"><span id="label">Go</span></button>';
    const label = document.getElementById("label");

    expect(isInteractiveTarget(label)).toBe(true);
  });

  it("respects data-draw-exclude on non-native elements", () => {
    document.body.innerHTML = '<div data-draw-exclude><span id="target"></span></div>';
    const target = document.getElementById("target");

    expect(isInteractiveTarget(target)).toBe(true);
  });

  it("lets data-draw-exclude win over data-draw-allow", () => {
    document.body.innerHTML =
      '<button type="button" data-draw-allow data-draw-exclude><span id="both">x</span></button>';
    const both = document.getElementById("both");

    expect(isInteractiveTarget(both)).toBe(true);
  });
});
