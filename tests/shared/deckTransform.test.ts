import { describe, expect, it } from "vitest";

import {
  getCyclicDeckCardRole,
  getDeckTransform,
  getLinearDeckCardRole,
  getWrappedIndex,
} from "@/shared/lib/deckTransform";

describe("deckTransform", () => {
  it("getCyclicDeckCardRole identifies active, next, and prev in a 3-card deck", () => {
    expect(getCyclicDeckCardRole(1, 1, 3)).toBe("active");
    expect(getCyclicDeckCardRole(2, 1, 3)).toBe("next");
    expect(getCyclicDeckCardRole(0, 1, 3)).toBe("prev");
  });

  it("getLinearDeckCardRole hides cards outside the adjacent stack", () => {
    expect(getLinearDeckCardRole(1, 1)).toBe("active");
    expect(getLinearDeckCardRole(2, 1)).toBe("next");
    expect(getLinearDeckCardRole(0, 1)).toBe("prev");
    expect(getLinearDeckCardRole(3, 1)).toBe("hidden");
  });

  it("getWrappedIndex wraps at deck boundaries", () => {
    expect(getWrappedIndex(0, -1, 3)).toBe(2);
    expect(getWrappedIndex(2, 1, 3)).toBe(0);
  });

  it("getDeckTransform removes rotation when reduced motion is enabled", () => {
    const active = getDeckTransform("active", true);
    const back = getDeckTransform("next", true);

    expect(active.transform).toBe("none");
    expect(active.isActive).toBe(true);
    expect(back.transform).toBe("none");
    expect(back.isActive).toBe(false);
  });

  it("getDeckTransform applies tilt to back cards in full motion mode", () => {
    const next = getDeckTransform("next", false);
    const prev = getDeckTransform("prev", false);

    expect(next.transform).toContain("rotate(2.5deg)");
    expect(prev.transform).toContain("rotate(-2.5deg)");
  });
});
