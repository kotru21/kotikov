"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseHorizontalScrollOptions {
  enabled?: boolean;
  scrollMultiplier?: number;
}

export const useHorizontalScroll = (
  options: UseHorizontalScrollOptions = {}
): {
  containerRef: React.RefObject<HTMLDivElement | null>;
  sectionRef: React.RefObject<HTMLElement | null>;
} => {
  const { enabled = true, scrollMultiplier = 2 } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const checkScrollPosition = useCallback((): {
    canScrollLeft: boolean;
    canScrollRight: boolean;
  } => {
    const container = containerRef.current;
    if (container === null) return { canScrollLeft: false, canScrollRight: false };

    const tolerance = 5;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const maxScrollLeft = scrollWidth - clientWidth;

    const canScrollLeft = scrollLeft > tolerance;
    const canScrollRight = scrollLeft < maxScrollLeft - tolerance;

    return { canScrollLeft, canScrollRight };
  }, []);

  const smoothScrollTo = useCallback((targetScrollLeft: number): void => {
    const container = containerRef.current;
    if (container === null) return;

    const startScrollLeft = container.scrollLeft;
    const distance = targetScrollLeft - startScrollLeft;
    const duration = 400;
    const startTime = performance.now();

    const animateScroll = (currentTime: number): void => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      container.scrollLeft = startScrollLeft + distance * easeOutCubic;
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      }
    };

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(animateScroll);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    const target = container;

    if (target === null || container === null) return;

    const handleWheel = (e: WheelEvent): void => {
      const { canScrollLeft, canScrollRight } = checkScrollPosition();
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;
      const shouldUseHorizontalScroll =
        (isScrollingDown && canScrollRight) || (isScrollingUp && canScrollLeft);

      if (shouldUseHorizontalScroll) {
        e.preventDefault();
        const scrollAmount = e.deltaY * scrollMultiplier;
        const targetScrollLeft = container.scrollLeft + scrollAmount;
        smoothScrollTo(targetScrollLeft);
      }
    };

    target.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      target.removeEventListener("wheel", handleWheel);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, scrollMultiplier, checkScrollPosition, smoothScrollTo]);

  return { containerRef, sectionRef };
};
