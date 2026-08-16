import { describe, expect, it } from "vitest";

import {
  TIMELINE_BAND_GRID,
  TIMELINE_SLIDE_STACK,
  TIMELINE_SLIDES_GRID,
  TIMELINE_TRACK_GRID,
  timelineSlideClass,
} from "@/widgets/timeline/ui/timelineSlideLock";

describe("timelineSlideLock", () => {
  it("keeps inactive slides in layout with invisible, not hidden", () => {
    const inactive = timelineSlideClass(false).split(/\s+/);
    const active = timelineSlideClass(true).split(/\s+/);

    expect(inactive).toEqual(expect.arrayContaining(["invisible", "pointer-events-none"]));
    expect(inactive).not.toContain("hidden");
    expect(active).toContain("visible");
    expect(active).not.toContain("invisible");

    for (const token of TIMELINE_SLIDE_STACK.split(/\s+/)) {
      expect(inactive).toContain(token);
      expect(active).toContain(token);
    }
  });

  it("stacks slides on row-start/row-end so span shorthand cannot unstack them", () => {
    const slides = TIMELINE_SLIDES_GRID.split(/\s+/);
    const stack = TIMELINE_SLIDE_STACK.split(/\s+/);
    const band = TIMELINE_BAND_GRID.split(/\s+/);

    expect(slides).toEqual(expect.arrayContaining(["min-w-0", "max-md:grid-rows-[auto_auto]"]));
    expect(slides).not.toContain("max-md:grid-rows-[auto_1fr]");
    expect(slides).not.toContain("md:grid-rows-none");

    expect(stack).toEqual(
      expect.arrayContaining([
        "col-start-1",
        "row-start-1",
        "row-end-2",
        "max-md:row-end-3",
        "max-md:grid-rows-subgrid",
      ])
    );
    expect(stack.some((token) => token.includes("row-span"))).toBe(false);

    expect(band).toEqual(
      expect.arrayContaining(["max-md:grid-rows-subgrid", "md:grid-cols-[minmax(11rem,16rem)_1fr]"])
    );
    expect(band.some((token) => token.includes("row-span"))).toBe(false);
    expect(TIMELINE_TRACK_GRID).toContain("minmax(0,1fr)");
  });
});
