import { describe, expect, it } from "vitest";

import {
  BAND_CAROUSEL_SLIDE,
  BAND_CAROUSEL_SLIDES,
  BAND_CAROUSEL_TRACK,
  bandCarouselSlideClass,
} from "@/shared/ui/BandCarousel";
import { TIMELINE_BAND_GRID } from "@/widgets/timeline/ui/TimelineBandItem";

describe("band carousel slide lock", () => {
  it("keeps inactive slides in layout with invisible, not hidden", () => {
    const inactive = bandCarouselSlideClass(false).split(/\s+/);
    const active = bandCarouselSlideClass(true).split(/\s+/);

    expect(inactive).toEqual(expect.arrayContaining(["invisible", "pointer-events-none"]));
    expect(inactive).not.toContain("hidden");
    expect(active).toContain("visible");
    expect(active).not.toContain("invisible");

    for (const token of BAND_CAROUSEL_SLIDE.split(/\s+/)) {
      expect(inactive).toContain(token);
      expect(active).toContain(token);
    }
  });

  it("stacks slides in one cell so chevrons can stretch to the tallest card", () => {
    expect(BAND_CAROUSEL_SLIDES.split(/\s+/)).toEqual(["grid", "min-w-0"]);
    expect(BAND_CAROUSEL_SLIDE.split(/\s+/)).toEqual(
      expect.arrayContaining(["col-start-1", "row-start-1", "grid", "h-full", "min-h-0", "min-w-0"])
    );
    expect(BAND_CAROUSEL_SLIDE.split(/\s+/).some((token) => token.includes("row-span"))).toBe(false);
    expect(BAND_CAROUSEL_TRACK).toContain("minmax(0,1fr)");
  });

  it("keeps the experience band as date above copy on mobile and two columns on desktop", () => {
    const band = TIMELINE_BAND_GRID.split(/\s+/);

    expect(band).toEqual(
      expect.arrayContaining([
        "grid-rows-[auto_1fr]",
        "md:grid-rows-none",
        "md:grid-cols-[minmax(11rem,16rem)_1fr]",
      ])
    );
    expect(band.some((token) => token.includes("row-span"))).toBe(false);
    expect(band).not.toContain("max-md:grid-rows-subgrid");
  });
});
