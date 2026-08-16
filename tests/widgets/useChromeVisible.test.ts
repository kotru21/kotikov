import { describe, expect, it } from "vitest";

import { shouldShowChrome } from "@/widgets/shell/hooks/useChromeVisible";

function entry(isIntersecting: boolean, bottom: number): {
  isIntersecting: boolean;
  boundingClientRect: { bottom: number };
} {
  return { isIntersecting, boundingClientRect: { bottom } };
}

describe("shouldShowChrome", () => {
  it("hides chrome while the puzzle still intersects below the viewport top", () => {
    expect(shouldShowChrome(entry(true, 400))).toBe(false);
    expect(shouldShowChrome(entry(true, 80))).toBe(false);
  });

  it("shows chrome when the puzzle is gone or its bottom has left the viewport", () => {
    expect(shouldShowChrome(entry(false, -8))).toBe(true);
    expect(shouldShowChrome(entry(true, 0))).toBe(true);
    expect(shouldShowChrome(entry(true, -1))).toBe(true);
  });
});
