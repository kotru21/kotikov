import { describe, expect, it } from "vitest";

import {
  computeContrastSample,
  computeCoverage,
  preferDarkTextFromLuminance,
  relativeLuminanceFromCssColor,
  sampleBrushAtPoint,
  sampleBrushStroke,
} from "@/shared/lib";

function rect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
    x: left,
    y: top,
    toJSON: () => ({}),
  };
}

describe("computeCoverage", () => {
  it("returns 0 when rects do not intersect", () => {
    const coverage = computeCoverage(rect(100, 100, 20, 20), rect(0, 0, 50, 50), () => true, 10);
    expect(coverage).toBe(0);
  });

  it("returns 1 when every overlapped cell is painted", () => {
    const painted = new Set(["0,0", "1,0", "0,1", "1,1"]);
    const coverage = computeCoverage(
      rect(0, 0, 20, 20),
      rect(0, 0, 40, 40),
      (c, r) => painted.has(`${String(c)},${String(r)}`),
      10
    );
    expect(coverage).toBe(1);
  });

  it("returns the painted fraction of overlapped cells", () => {
    const painted = new Set(["0,0"]);
    const coverage = computeCoverage(
      rect(0, 0, 20, 20),
      rect(0, 0, 40, 40),
      (c, r) => painted.has(`${String(c)},${String(r)}`),
      10
    );
    expect(coverage).toBe(0.25);
  });
});

describe("relativeLuminanceFromCssColor", () => {
  it("returns high luminance for near-white mint", () => {
    const L = relativeLuminanceFromCssColor("#63ffd5");
    expect(L).not.toBeNull();
    expect(L!).toBeGreaterThan(0.7);
  });

  it("returns low luminance for near-black", () => {
    const L = relativeLuminanceFromCssColor("#111111");
    expect(L).not.toBeNull();
    expect(L!).toBeLessThan(0.05);
  });

  it("returns null for non-hex colors", () => {
    expect(relativeLuminanceFromCssColor("black")).toBeNull();
  });
});

describe("preferDarkTextFromLuminance", () => {
  it("prefers dark text on bright backgrounds", () => {
    expect(preferDarkTextFromLuminance(0.8)).toBe(true);
  });

  it("prefers light text on dark backgrounds", () => {
    expect(preferDarkTextFromLuminance(0.2)).toBe(false);
  });
});

describe("computeContrastSample", () => {
  it("returns coverage 0 and null luminance when no painted cells", () => {
    const sample = computeContrastSample(
      rect(0, 0, 20, 20),
      rect(0, 0, 40, 40),
      () => undefined,
      10
    );
    expect(sample.coverage).toBe(0);
    expect(sample.luminance).toBeNull();
    expect(sample.preferDarkText).toBe(false);
  });

  it("averages luminance of painted cells only", () => {
    const cells = new Map([
      ["0,0", { color: "#ffffff" }],
      ["1,0", { color: "#000000" }],
    ]);
    const sample = computeContrastSample(
      rect(0, 0, 20, 10),
      rect(0, 0, 40, 40),
      (c, r) => cells.get(`${String(c)},${String(r)}`),
      10
    );
    expect(sample.coverage).toBe(1);
    expect(sample.luminance).not.toBeNull();
    expect(sample.luminance!).toBeGreaterThan(0.4);
    expect(sample.luminance!).toBeLessThan(0.6);
  });

  it("ignores unpainted cells in the luminance average", () => {
    const cells = new Map([["0,0", { color: "#ffffff" }]]);
    const sample = computeContrastSample(
      rect(0, 0, 20, 20),
      rect(0, 0, 40, 40),
      (c, r) => cells.get(`${String(c)},${String(r)}`),
      10
    );
    expect(sample.coverage).toBe(0.25);
    expect(sample.luminance).not.toBeNull();
    expect(sample.luminance!).toBeGreaterThan(0.9);
    expect(sample.preferDarkText).toBe(true);
  });
});

describe("sampleBrushStroke", () => {
  it("samples at least the brush center cell for a stationary stroke", () => {
    const pixels = sampleBrushStroke(15, 15, 15, 15, 10, 12);
    expect(pixels.size).toBeGreaterThan(0);
    expect(pixels.has("1,1")).toBe(true);
  });

  it("keeps the max intensity when sampling overlapping points", () => {
    const atPoint = sampleBrushAtPoint(15, 15, 10, 12);
    const stroke = sampleBrushStroke(15, 15, 15, 15, 10, 12);
    const key = "1,1";
    expect(stroke.get(key)?.intensity).toBe(atPoint.get(key)?.intensity);
  });

  it("covers intermediate cells along a longer stroke", () => {
    const pixels = sampleBrushStroke(5, 5, 45, 5, 10, 8);
    expect(pixels.size).toBeGreaterThan(3);
    expect([...pixels.values()].every((p) => p.intensity > 0 && p.intensity <= 1)).toBe(true);
  });
});
