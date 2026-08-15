import { describe, expect, it } from "vitest";

import {
  GRID_BAND_STACK,
  GRID_DIVIDE,
  GRID_DIVIDE_X,
  GRID_RULE_BOTTOM,
  GRID_RULE_TOP,
  GRID_STROKE,
  GRID_STROKE_OMIT_BOTTOM,
  GRID_STROKE_OMIT_LEFT,
  GRID_STROKE_OMIT_RIGHT,
  GRID_STROKE_OMIT_TOP,
  GRID_STROKE_OMIT_Y,
  gridStrokeForBand,
} from "@/shared/ui";

describe("grid chrome band collapse", () => {
  it("keeps the editorial 2px ink in light and dark", () => {
    expect(GRID_STROKE).toContain("border-2");
    expect(GRID_STROKE).toContain("border-[#111]");
    expect(GRID_STROKE).toContain("dark:border-[#ededed]");
    expect(GRID_DIVIDE).toContain("divide-y-2");
    expect(GRID_DIVIDE).toContain("divide-[#111]");
    expect(GRID_DIVIDE).toContain("dark:divide-[#ededed]");
    expect(GRID_DIVIDE_X).toContain("divide-x-2");
    expect(GRID_DIVIDE_X).toContain("divide-[#111]");
    expect(GRID_BAND_STACK).toContain("border-t-2");
    expect(GRID_BAND_STACK).toContain(GRID_DIVIDE);
    expect(GRID_BAND_STACK).not.toMatch(/\bborder-l-2\b/);
    expect(GRID_BAND_STACK).not.toMatch(/\bborder-r-2\b/);
    expect(GRID_BAND_STACK).not.toMatch(/\bborder-x-2\b/);
    expect(GRID_BAND_STACK).not.toContain(GRID_STROKE);
  });

  it("omits only the flush edge so stacked cells do not paint a second rule", () => {
    expect(GRID_STROKE_OMIT_TOP).toContain("border-x-2");
    expect(GRID_STROKE_OMIT_TOP).toContain("border-b-2");
    expect(GRID_STROKE_OMIT_TOP).not.toMatch(/(^|\s)border-2(\s|$)/);
    expect(GRID_STROKE_OMIT_BOTTOM).toContain("border-t-2");
    expect(GRID_STROKE_OMIT_BOTTOM).not.toMatch(/(^|\s)border-2(\s|$)/);
    expect(GRID_STROKE_OMIT_Y).toBe("border-0");
    expect(GRID_STROKE_OMIT_Y).not.toMatch(/border-[xltb]-2/);
    expect(GRID_STROKE_OMIT_LEFT.split(/\s+/)).toEqual(
      expect.arrayContaining(["border-y-2", "border-r-2", "border-[#111]", "dark:border-[#ededed]"])
    );
    expect(GRID_STROKE_OMIT_RIGHT.split(/\s+/)).toEqual(
      expect.arrayContaining(["border-y-2", "border-l-2", "border-[#111]", "dark:border-[#ededed]"])
    );
    expect(GRID_STROKE_OMIT_LEFT).not.toMatch(/(^|\s)border-2(\s|$)/);
    expect(GRID_STROKE_OMIT_RIGHT).not.toMatch(/(^|\s)border-2(\s|$)/);
  });

  it("picks horizontal-only rules for stacked content cells", () => {
    expect(gridStrokeForBand(0, 1)).toBe(GRID_STROKE_OMIT_Y);
    expect(gridStrokeForBand(0, 3)).toBe(GRID_RULE_BOTTOM);
    expect(gridStrokeForBand(1, 3)).toBe(GRID_RULE_TOP);
    expect(gridStrokeForBand(2, 3)).toBe(GRID_RULE_TOP);
  });
});
