import { describe, expect, it } from "vitest";

import { CHROME_SLIDE_MS, chromeSlideClass } from "@/widgets/shell/lib/chromeMotion";

describe("chromeSlideClass", () => {
  it("slides in on transform with 300ms ease-out", () => {
    expect(CHROME_SLIDE_MS).toBe(300);
    expect(chromeSlideClass(true, "left", false).split(/\s+/)).toEqual(
      expect.arrayContaining([
        "motion-safe:transition-transform",
        "motion-safe:duration-300",
        "motion-safe:ease-out",
        "translate-x-0",
      ])
    );
    expect(chromeSlideClass(true, "top", false)).toContain("translate-y-0");
    expect(chromeSlideClass(true, "bottom", false)).toContain("translate-y-0");
  });

  it("reverses off-canvas with ease-in instead of popping out", () => {
    expect(chromeSlideClass(false, "left", false).split(/\s+/)).toEqual(
      expect.arrayContaining(["-translate-x-full", "motion-safe:ease-in"])
    );
    expect(chromeSlideClass(false, "top", false)).toContain("-translate-y-full");
    expect(chromeSlideClass(false, "bottom", false)).toContain("translate-y-full");
    expect(chromeSlideClass(false, "left", false)).not.toContain("ease-out");
  });

  it("skips the slide when motion should be instant", () => {
    expect(chromeSlideClass(true, "left", true).split(/\s+/)).toEqual(
      expect.arrayContaining(["transition-none", "translate-x-0"])
    );
    expect(chromeSlideClass(false, "right", true).split(/\s+/)).toEqual(
      expect.arrayContaining(["transition-none", "translate-x-full"])
    );
    expect(chromeSlideClass(true, "left", true)).not.toContain("transition-transform");
  });
});
