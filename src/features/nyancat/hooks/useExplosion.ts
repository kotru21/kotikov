"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { usePerformanceSettings } from "@/features/performance";

import {
  EXPLOSION_DURATION,
  EXPLOSION_RENDER_INTERVAL_MS,
  type NyancatSize,
} from "../lib/constants";
import { generateExplosionPixels, getElementCenter, updatePixelPhysics } from "../lib/utils";
import type { Pixel, Position } from "../types";

interface UseExplosionReturn {
  isExploded: boolean;
  pixels: Pixel[];
  explosionPosition: Position;
  nyancatRef: React.RefObject<HTMLDivElement | null>;
  explode: () => void;
}

export const useExplosion = (size: NyancatSize): UseExplosionReturn => {
  const [isExploded, setIsExploded] = useState(false);
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [explosionPosition, setExplosionPosition] = useState({
    x: 0,
    y: 0,
  });
  const nyancatRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const lastRenderRef = useRef(0);
  const { reducedMotion, lowPerformance } = usePerformanceSettings();

  const explode = useCallback(() => {
    if (isExploded || nyancatRef.current === null) return;

    const center = getElementCenter(nyancatRef.current);
    setExplosionPosition(center);
    setIsExploded(true);

    const initial = generateExplosionPixels(size);
    const pruned =
      reducedMotion || lowPerformance ? initial.slice(0, Math.ceil(initial.length * 0.4)) : initial;
    pixelsRef.current = pruned;
    setPixels(pruned);

    startTimeRef.current = performance.now();
    lastRenderRef.current = 0;

    const tick = (now: number): void => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(1, elapsed / EXPLOSION_DURATION);

      if (elapsed >= EXPLOSION_DURATION || reducedMotion) {
        setIsExploded(false);
        setPixels([]);
        pixelsRef.current = [];
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        return;
      }

      pixelsRef.current = pixelsRef.current.map((pixel) => updatePixelPhysics(pixel, progress));

      if (now - lastRenderRef.current >= EXPLOSION_RENDER_INTERVAL_MS) {
        lastRenderRef.current = now;
        setPixels(pixelsRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [isExploded, size, reducedMotion, lowPerformance]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    isExploded,
    pixels,
    explosionPosition,
    nyancatRef,
    explode,
  };
};
