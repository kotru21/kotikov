"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { usePerformanceSettings } from "@/features/performance";

import { ANIMATION_INTERVAL, EXPLOSION_DURATION, type NyancatSize } from "../lib/constants";
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
  const [explosionPosition, setExplosionPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const nyancatRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const { reducedMotion, lowPerformance } = usePerformanceSettings();

  const explode = useCallback(() => {
    if (isExploded || nyancatRef.current === null) return;

    const center = getElementCenter(nyancatRef.current);
    setExplosionPosition(center);
    setIsExploded(true);

    const initial = generateExplosionPixels(size);
    // деградация для low perf / reduced motion
    const pruned =
      reducedMotion || lowPerformance ? initial.slice(0, Math.ceil(initial.length * 0.4)) : initial;
    pixelsRef.current = pruned;
    setPixels(pruned);

    startTimeRef.current = performance.now();

    const tick = (): void => {
      const now = performance.now();
      const elapsed = now - startTimeRef.current;
      if (elapsed >= EXPLOSION_DURATION || reducedMotion) {
        setIsExploded(false);
        setPixels([]);
        pixelsRef.current = [];
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        return;
      }

      // обновляем физику в ref, чтобы не триггерить React на каждый кадр
      pixelsRef.current = pixelsRef.current.map(updatePixelPhysics);

      // ограничиваем частоту React-обновлений до ~30 FPS для уменьшения reconcile
      if (Math.floor(elapsed / 33) !== Math.floor((elapsed - ANIMATION_INTERVAL) / 33)) {
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
