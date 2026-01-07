import React from "react";

interface PixelWaveDividerProps {
  className?: string;
  /** Height of the divider in SVG user units (maps to CSS height via container). */
  height?: number;
  /** Width of the internal viewBox used for path generation. */
  width?: number;
  /** Horizontal step size for the pixelated wave (bigger = chunkier pixels). */
  step?: number;
  /** Vertical pixel size (wave will snap to multiples of this). */
  pixel?: number;
  /** Deterministic seed to tweak the “randomness” without hydration issues. */
  seed?: number;
}

/**
 * Pixelated wave-shaped divider.
 *
 * Renders a filled shape with a jagged (stepped) bottom edge.
 * Use `currentColor` (via `text-*` classes) to control the fill.
 */
export const PixelWaveDivider: React.FC<PixelWaveDividerProps> = ({
  className,
  height = 96,
  width = 1200,
  step = 40,
  pixel = 8,
  seed = 1,
}) => {
  const steps = Math.max(1, Math.ceil(width / step));

  // A repeating stepped “wave” profile. Values are in pixel-units (multipliers).
  const profile = [0, 1, 2, 3, 4, 3, 2, 1] as const;

  const snap = (value: number) => Math.round(value / pixel) * pixel;

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  // Deterministic pseudo-random in [0..1) for integer input.
  const hash01 = (n: number) => {
    const x = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453123;
    return x - Math.floor(x);
  };

  const base = snap(height * 0.55);
  const amp = pixel * 2; // 16px by default

  const yAt: number[] = Array.from({ length: steps + 1 }, (_, i) => {
    // Make the right side a bit “bigger” than the left.
    const t = steps === 0 ? 0 : i / steps;
    const ampScale = 0.7 + 0.7 * t; // left ~0.70, right ~1.40

    // Add small stepped jitter: -1..+1 (sometimes 0) in profile space.
    const r = hash01(i);
    const jitter = r < 0.25 ? -1 : r > 0.75 ? 1 : 0;

    const baseLevel = profile[i % profile.length];
    const level = clamp(baseLevel + jitter, 0, 6);

    const y = base + level * amp * ampScale;
    return clamp(snap(y), 0, height);
  });

  // Build a filled polygon: top is flat, bottom is stepped.
  let d = `M 0 0 H ${width} V ${yAt[steps]}`;
  for (let i = steps; i > 0; i--) {
    const xPrev = (i - 1) * step;
    d += ` H ${xPrev} V ${yAt[i - 1]}`;
  }
  d += " H 0 V 0 Z";

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} fill="currentColor" />
    </svg>
  );
};

export default PixelWaveDivider;
