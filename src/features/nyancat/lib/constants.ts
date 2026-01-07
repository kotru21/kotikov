import { colors } from "@/styles/colors";

export const EXPLOSION_COLORS = [
  colors.accent[500],
  colors.accent[300],
  colors.accent[700],
  colors.neutral[50],
  colors.neutral[900],
] as const;

export const EXPLOSION_DURATION = 3000;
export const ANIMATION_FPS = 60;
export const ANIMATION_INTERVAL = 1000 / ANIMATION_FPS;

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
    trailWidthStep: 2,
    trailSpacing: 5,
    trailOffset: 8,
    hueStep: 72,
    hueOffset: 144,
    lightness: 75,
    borderRadius: 1,
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
    trailWidthStep: 3,
    trailSpacing: 6,
    trailOffset: 12,
    hueStep: 60,
    hueOffset: 120,
    lightness: 70,
    borderRadius: 2,
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
    trailWidthStep: 3,
    trailSpacing: 8,
    trailOffset: 15,
    hueStep: 45,
    hueOffset: 90,
    lightness: 65,
    borderRadius: 2,
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
    trailWidthStep: 3,
    trailSpacing: 12,
    trailOffset: 25,
    hueStep: 30,
    hueOffset: 60,
    lightness: 60,
    borderRadius: 3,
  },
} as const;

export type NyancatSize = keyof typeof SIZE_CONFIG;
