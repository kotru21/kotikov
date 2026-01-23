import type { Pixel, Position } from "../types";
import { EXPLOSION_COLORS, type NyancatSize , SIZE_CONFIG } from "./constants";

export const generateExplosionPixels = (size: NyancatSize): Pixel[] => {
  const config = SIZE_CONFIG[size];
  const pixels: Pixel[] = [];
  const shapes: Array<"square" | "circle" | "triangle"> = [
    "square",
    "circle",
    "triangle",
  ];

  for (let i = 0; i < config.pixelCount; i++) {
    pixels.push({
      id: i,
      x: 0,
      y: 0,
      color:
        EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)],
      velocityX: (Math.random() - 0.5) * 300,
      velocityY: (Math.random() - 0.5) * 300,
      size: Math.random() * 8 + 4,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    });
  }

  return pixels;
};

export const updatePixelPhysics = (pixel: Pixel): Pixel => ({
  ...pixel,
  x: pixel.x + pixel.velocityX * 0.016,
  y: pixel.y + pixel.velocityY * 0.016,
  velocityY: pixel.velocityY + 10, // Gravity
  rotation: pixel.rotation + pixel.rotationSpeed,
});

export const getElementCenter = (element: HTMLElement): Position => {
  const rect = element.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

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
  _index: number,
  size: NyancatSize
): number => {
  const config = SIZE_CONFIG[size];
  // Bauhaus style: constant width blocks
  return config.trailWidth;
};

export const calculateTrailHeight = (
  _index: number,
  size: NyancatSize
): number => {
  const config = SIZE_CONFIG[size];
  // Bauhaus style: constant height blocks
  return config.trailHeight;
};

export const generateTrailGradient = (
  index: number,
  _size: NyancatSize
): string => {
  // Bauhaus style: alternating solid primary colors
  const colors = [
    EXPLOSION_COLORS[0], // Red
    EXPLOSION_COLORS[1], // Yellow
    EXPLOSION_COLORS[2], // Blue
  ];
  return colors[index % 3];
};

export const calculateTrailTransform = (
  index: number,
  size: NyancatSize
): string => {
  const config = SIZE_CONFIG[size];
  const translateX = -index * config.trailSpacing;
  const translateY = config.trailOffset + index;

  return `translateX(${String(translateX)}px) translateY(${String(translateY)}px)`;
};
