import { describe, expect, it } from "vitest";

import {
  getDeckCardRole,
  getDeckTransform,
  getWrappedIndex,
} from "@/widgets/projects/ui/getDeckTransform";

describe("project deck utils re-exports", () => {
  it("re-exports shared deck transform helpers", () => {
    expect(getDeckCardRole(1, 1, 3)).toBe("active");
    expect(getWrappedIndex(0, -1, 3)).toBe(2);
    expect(getDeckTransform("active", true).isActive).toBe(true);
  });
});
