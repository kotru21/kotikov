import { afterEach, describe, expect, it, vi } from "vitest";

import { EXPLOSION_COLORS, SIZE_CONFIG } from "@/features/nyancat/lib/constants";
import {
  calculateTrailHeight,
  calculateTrailOpacity,
  calculateTrailTransform,
  calculateTrailWidth,
  generateExplosionPixels,
  generateTrailGradient,
  getElementCenter,
  updatePixelPhysics,
} from "@/features/nyancat/lib/utils";
import type { Pixel } from "@/features/nyancat/types";

function basePixel(overrides: Partial<Pixel> = {}): Pixel {
  return {
    id: 0,
    x: 0,
    y: 0,
    color: EXPLOSION_COLORS[0],
    velocityX: 60,
    velocityY: -30,
    size: 5,
    shape: "square",
    rotation: 10,
    rotationSpeed: 4,
    opacity: 1,
    ...overrides,
  };
}

describe("generateExplosionPixels", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates the configured pixel count with valid fields", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.25);

    const pixels = generateExplosionPixels("small");

    expect(pixels).toHaveLength(SIZE_CONFIG.small.pixelCount);
    for (const [index, pixel] of pixels.entries()) {
      expect(pixel.id).toBe(index);
      expect(pixel.x).toBe(0);
      expect(pixel.y).toBe(0);
      expect(pixel.opacity).toBe(1);
      expect(EXPLOSION_COLORS).toContain(pixel.color);
      expect(["square", "circle", "triangle"]).toContain(pixel.shape);
      expect(pixel.size).toBeGreaterThan(0);
      expect(Number.isFinite(pixel.velocityX)).toBe(true);
      expect(Number.isFinite(pixel.velocityY)).toBe(true);
    }
  });

  it("scales pixel count with size", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    expect(generateExplosionPixels("medium")).toHaveLength(SIZE_CONFIG.medium.pixelCount);
    expect(generateExplosionPixels("large")).toHaveLength(SIZE_CONFIG.large.pixelCount);
    expect(generateExplosionPixels("xlarge")).toHaveLength(SIZE_CONFIG.xlarge.pixelCount);
  });
});

describe("updatePixelPhysics", () => {
  it("keeps full opacity in the early phase and advances position", () => {
    const next = updatePixelPhysics(basePixel(), 0.2);

    expect(next.opacity).toBe(1);
    expect(next.x).not.toBe(0);
    expect(next.y).not.toBe(0);
    expect(next.rotation).toBe(14);
    expect(Math.abs(next.velocityX)).toBeLessThan(Math.abs(60));
  });

  it("fades opacity in the late phase and clamps at zero", () => {
    const mid = updatePixelPhysics(basePixel(), 0.7);
    expect(mid.opacity).toBeGreaterThan(0);
    expect(mid.opacity).toBeLessThan(1);

    const end = updatePixelPhysics(basePixel(), 1);
    expect(end.opacity).toBe(0);
  });
});

describe("getElementCenter", () => {
  it("returns the center of the element box", () => {
    const el = document.createElement("div");
    el.getBoundingClientRect = (): DOMRect => ({
      left: 10,
      top: 20,
      width: 40,
      height: 20,
      right: 50,
      bottom: 40,
      x: 10,
      y: 20,
      toJSON: () => ({}),
    });

    expect(getElementCenter(el)).toEqual({ x: 30, y: 30 });
  });
});

describe("trail helpers", () => {
  it("computes opacity, size, gradient, and transform from size config", () => {
    const size = "medium";
    const config = SIZE_CONFIG[size];

    expect(calculateTrailOpacity(0, size)).toBe(1);
    expect(calculateTrailOpacity(3, size)).toBe(Math.max(0.12, 1 - 3 * config.opacityStep));
    expect(calculateTrailOpacity(100, size)).toBe(0.12);

    expect(calculateTrailWidth(size)).toBe(config.trailWidth);
    expect(calculateTrailHeight(size)).toBe(config.trailHeight);

    expect(generateTrailGradient(0)).toBe(EXPLOSION_COLORS[0]);
    expect(generateTrailGradient(1)).toBe(EXPLOSION_COLORS[1]);
    expect(generateTrailGradient(2)).toBe(EXPLOSION_COLORS[2]);
    expect(generateTrailGradient(3)).toBe(EXPLOSION_COLORS[0]);

    expect(calculateTrailTransform(2, size)).toBe(
      `translate3d(${String(-2 * config.trailSpacing)}px, ${String(config.trailOffset + 2 * 0.6)}px, 0)`
    );
  });
});
