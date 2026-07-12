import type { Pixel, Position } from "../types";
import { EXPLOSION_COLORS, type NyancatSize, SIZE_CONFIG } from "./constants";

const FRAME_DT = 1 / 60;
const DRAG = 0.985;
const GRAVITY = 420;

export function generateExplosionPixels(size: NyancatSize): Pixel[] {
  const config = SIZE_CONFIG[size];
  const pixels: Pixel[] = [];
  const shapes: Array<"square" | "circle" | "triangle"> = ["square", "circle", "triangle"];

  for (let i = 0; i < config.pixelCount; i++) {
    const angle = (Math.PI * 2 * i) / config.pixelCount + (Math.random() - 0.5) * 0.45;
    const speed = 140 + Math.random() * 220;

    pixels.push({
      id: i,
      x: 0,
      y: 0,
      color: EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)],
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed - 40,
      size: Math.random() * 7 + 3,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 14,
      opacity: 1,
    });
  }

  return pixels;
}

export function updatePixelPhysics(pixel: Pixel, progress: number): Pixel {
  const velocityX = pixel.velocityX * DRAG;
  const velocityY = pixel.velocityY * DRAG + GRAVITY * FRAME_DT;
  const fade = progress < 0.45 ? 1 : 1 - (progress - 0.45) / 0.55;

  return {
    ...pixel,
    x: pixel.x + velocityX * FRAME_DT,
    y: pixel.y + velocityY * FRAME_DT,
    velocityX,
    velocityY,
    rotation: pixel.rotation + pixel.rotationSpeed,
    opacity: Math.max(0, fade),
  };
}

export function getElementCenter(element: HTMLElement): Position {
  const rect = element.getBoundingClientRect();

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function calculateTrailOpacity(index: number, size: NyancatSize): number {
  const config = SIZE_CONFIG[size];
  return Math.max(0.12, 1 - index * config.opacityStep);
}

export function calculateTrailWidth(size: NyancatSize): number {
  return SIZE_CONFIG[size].trailWidth;
}

export function calculateTrailHeight(size: NyancatSize): number {
  return SIZE_CONFIG[size].trailHeight;
}

export function generateTrailGradient(index: number): string {
  const trailColors = [EXPLOSION_COLORS[0], EXPLOSION_COLORS[1], EXPLOSION_COLORS[2]];
  return trailColors[index % 3];
}

export function calculateTrailTransform(index: number, size: NyancatSize): string {
  const config = SIZE_CONFIG[size];
  const translateX = -index * config.trailSpacing;
  const translateY = config.trailOffset + index * 0.6;

  return `translate3d(${String(translateX)}px, ${String(translateY)}px, 0)`;
}
