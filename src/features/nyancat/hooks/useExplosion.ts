import { useState, useEffect, useRef, useCallback } from "react";
import {
  generateExplosionPixels,
  updatePixelPhysics,
  getElementCenter,
} from "../lib/utils";
import { EXPLOSION_DURATION, ANIMATION_INTERVAL } from "../lib/constants";
import type { Pixel, Position } from "../types";
import type { NyancatSize } from "../lib/constants";

export const useExplosion = (size: NyancatSize) => {
  const [isExploded, setIsExploded] = useState(false);
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [explosionPosition, setExplosionPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const nyancatRef = useRef<HTMLDivElement>(null);

  const explode = useCallback(() => {
    if (isExploded || !nyancatRef.current) return;

    const center = getElementCenter(nyancatRef.current);
    setExplosionPosition(center);
    setIsExploded(true);
    setPixels(generateExplosionPixels(size));

    const timeoutId = setTimeout(() => {
      setIsExploded(false);
      setPixels([]);
    }, EXPLOSION_DURATION);

    return () => clearTimeout(timeoutId);
  }, [isExploded, size]);

  useEffect(() => {
    if (!isExploded || pixels.length === 0) return;

    const interval = setInterval(() => {
      setPixels((prevPixels) => prevPixels.map(updatePixelPhysics));
    }, ANIMATION_INTERVAL);

    return () => clearInterval(interval);
  }, [isExploded, pixels.length]);

  return {
    isExploded,
    pixels,
    explosionPosition,
    nyancatRef,
    explode,
  };
};
