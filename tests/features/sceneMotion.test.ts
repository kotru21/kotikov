import { describe, expect, it } from "vitest";

import { resolveSceneMotion } from "@/features/performance";

const baseInput = {
  reducedMotion: false,
  lowPerformance: false,
  isInView: true,
  isDocumentVisible: true,
  dominantEffect: "marquee" as const,
};

describe("resolveSceneMotion", () => {
  it("allows the dominant continuous effect in an active scene", () => {
    expect(resolveSceneMotion(baseInput).canRunContinuous).toBe(true);
  });

  it.each([
    { reducedMotion: true },
    { lowPerformance: true },
    { isInView: false },
    { isDocumentVisible: false },
    { dominantEffect: "none" as const },
  ])("blocks continuous motion for %o", (override) => {
    expect(resolveSceneMotion({ ...baseInput, ...override }).canRunContinuous).toBe(false);
  });
});
