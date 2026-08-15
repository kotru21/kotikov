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

  it("locks date and copy on a two-row subgrid, reset to one cell on desktop", () => {
    expect(TIMELINE_SLIDES_GRID.split(/\s+/)).toEqual(
      expect.arrayContaining(["min-w-0", "grid-rows-[auto_1fr]", "md:grid-rows-none"])
    );
    expect(TIMELINE_SLIDE_STACK.split(/\s+/)).toEqual(
      expect.arrayContaining([
        "col-start-1",
        "row-start-1",
        "row-span-2",
        "grid-rows-subgrid",
        "md:row-span-1",
        "md:grid-rows-none",
      ])
    );
    expect(TIMELINE_BAND_GRID.split(/\s+/)).toEqual(
      expect.arrayContaining([
        "grid-rows-subgrid",
        "md:grid-cols-[minmax(11rem,16rem)_1fr]",
        "md:grid-rows-none",
      ])
    );
    expect(TIMELINE_TRACK_GRID).toContain("minmax(0,1fr)");
  });
});
