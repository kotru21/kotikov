import { describe, expect, it } from "vitest";

import {
  getTimelineTypeChipClass,
  getTimelineTypeEyebrowClass,
} from "@/widgets/timeline/ui/timelineTypeStyles";

describe("timelineTypeStyles", () => {
  it("returns work eyebrow and active chip classes", () => {
    expect(getTimelineTypeEyebrowClass("work")).toContain("border-primary-500");
    expect(getTimelineTypeChipClass("work", true)).toContain("bg-primary-500");
  });

  it("returns education eyebrow and active chip classes", () => {
    expect(getTimelineTypeEyebrowClass("education")).toContain("bg-neutral-100");
    expect(getTimelineTypeChipClass("education", true)).toContain("bg-neutral-200");
  });

  it("returns hackathon eyebrow and active chip classes", () => {
    expect(getTimelineTypeEyebrowClass("hackathon")).toContain("bg-primary-100");
    expect(getTimelineTypeChipClass("hackathon", true)).toContain("bg-primary-100");
  });

  it("returns empty string for inactive chip accent", () => {
    expect(getTimelineTypeChipClass("work", false)).toBe("");
  });
});
