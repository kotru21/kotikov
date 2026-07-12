import { colors } from "@/styles/colors";

export const EXPLOSION_COLORS = [
  colors.accent[500],
  colors.accent[300],
  colors.accent[700],
  colors.neutral[50],
  colors.neutral[900],
] as const;

export const EXPLOSION_DURATION = 2200;
/** React state flush cadence for explosion pixels (~45 FPS). */
export const EXPLOSION_RENDER_INTERVAL_MS = 22;

export const SIZE_CONFIG = {
  small: {
    width: 35,
    height: 23,
    trailSegments: 5,
    trailWidth: 18,
    trailHeight: 6,
    pixelCount: 15,
    trailDelay: 0.06,
    opacityStep: 0.18,
    trailSpacing: 5,
    trailOffset: 8,
  },
  medium: {
    width: 50,
    height: 33,
    trailSegments: 6,
    trailWidth: 25,
    trailHeight: 8,
    pixelCount: 25,
    trailDelay: 0.08,
    opacityStep: 0.15,
    trailSpacing: 6,
    trailOffset: 12,
  },
  large: {
    width: 70,
    height: 47,
    trailSegments: 8,
    trailWidth: 35,
    trailHeight: 12,
    pixelCount: 35,
    trailDelay: 0.1,
    opacityStep: 0.12,
    trailSpacing: 8,
    trailOffset: 15,
  },
  xlarge: {
    width: 120,
    height: 80,
    trailSegments: 12,
    trailWidth: 60,
    trailHeight: 20,
    pixelCount: 50,
    trailDelay: 0.15,
    opacityStep: 0.1,
    trailSpacing: 12,
    trailOffset: 25,
  },
} as const;

export type NyancatSize = keyof typeof SIZE_CONFIG;
