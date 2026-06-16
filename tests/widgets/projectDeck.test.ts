import { describe, expect, it } from "vitest";

import {
  getDeckCardRole,
  getDeckTransform,
  getWrappedIndex,
} from "@/widgets/projects/ui/getDeckTransform";

describe("project deck utils", () => {
  it("getDeckCardRole identifies active, next, and prev in a 3-card deck", () => {
    expect(getDeckCardRole(1, 1, 3)).toBe("active");
    expect(getDeckCardRole(2, 1, 3)).toBe("next");
    expect(getDeckCardRole(0, 1, 3)).toBe("prev");
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
