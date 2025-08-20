import { EXPLOSION_COLORS, SIZE_CONFIG } from "./constants";
import type { Pixel, Position } from "../types";
import type { NyancatSize } from "./constants";

export const generateExplosionPixels = (size: NyancatSize): Pixel[] => {
  const config = SIZE_CONFIG[size];
  const pixels: Pixel[] = [];

  for (let i = 0; i < config.pixelCount; i++) {
    pixels.push({
      id: i,
      x: Math.random() * 40 - 20,
      y: Math.random() * 40 - 20,
      color:
        EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)],
      velocityX: (Math.random() - 0.5) * 200,
      velocityY: (Math.random() - 0.5) * 200,
      size: Math.random() * 4 + 2,
    });
  }

  return pixels;
};

export const updatePixelPhysics = (pixel: Pixel): Pixel => ({
  ...pixel,
  x: pixel.x + pixel.velocityX * 0.02,
  y: pixel.y + pixel.velocityY * 0.02,
  velocityY: pixel.velocityY + 5, // Gravity
});

export const getElementCenter = (element: HTMLElement): Position => {
  const rect = element.getBoundingClientRect();
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;

  return {
    x: rect.left + scrollX + rect.width / 2,
    y: rect.top + scrollY + rect.height / 2,
  };
};

export const calculateTrailOpacity = (
  index: number,
  size: NyancatSize
): number => {
  const config = SIZE_CONFIG[size];
  return Math.max(0.1, 1 - index * config.opacityStep);
};

export const calculateTrailWidth = (
  index: number,
  size: NyancatSize
): number => {
  const config = SIZE_CONFIG[size];
  return Math.max(6, config.trailWidth - index * config.trailWidthStep);
};

export const calculateTrailHeight = (
  index: number,
  size: NyancatSize
): number => {
  const config = SIZE_CONFIG[size];
  return Math.max(2, config.trailHeight - index * 1);
};

export const generateTrailGradient = (
  index: number,
  size: NyancatSize
): string => {
  const config = SIZE_CONFIG[size];
  const baseHue = (index * config.hueStep) % 360;

  const colors = [
    `hsl(${baseHue}, 100%, ${config.lightness}%)`,
    `hsl(${(baseHue + config.hueOffset) % 360}, 100%, ${config.lightness}%)`,
    `hsl(${(baseHue + config.hueOffset * 2) % 360}, 100%, ${
      config.lightness
    }%)`,
  ];

  return `linear-gradient(90deg, ${colors.join(", ")})`;
};

export const calculateTrailTransform = (
  index: number,
  size: NyancatSize
): string => {
  const config = SIZE_CONFIG[size];
  const translateX = -index * config.trailSpacing;
  const translateY = config.trailOffset + index;

  return `translateX(${translateX}px) translateY(${translateY}px)`;
};
