import { describe, expect, it } from "vitest";

import { getTimelineTypeChipClass, getTimelineTypeEyebrowClass } from "@/widgets/timeline/ui";

describe("timelineTypeStyles", () => {
  it("returns work eyebrow and active chip classes", () => {
    expect(getTimelineTypeEyebrowClass("work")).toContain("text-primary-800");
    expect(getTimelineTypeChipClass("work", true)).toContain("bg-primary-500");
    expect(getTimelineTypeChipClass("work", true)).toContain("text-black");
  });

  it("returns education eyebrow and active chip classes", () => {
    expect(getTimelineTypeEyebrowClass("education")).toContain("text-neutral-600");
    expect(getTimelineTypeChipClass("education", true)).toContain("bg-neutral-200");
  });

  it("returns hackathon eyebrow and active chip classes", () => {
    expect(getTimelineTypeEyebrowClass("hackathon")).toContain("text-primary-700");
    expect(getTimelineTypeChipClass("hackathon", true)).toContain("bg-primary-100");
    expect(getTimelineTypeChipClass("hackathon", true)).toContain("text-black");
  });

  it("returns empty string for inactive chip accent", () => {
    expect(getTimelineTypeChipClass("work", false)).toBe("");
  });
});
