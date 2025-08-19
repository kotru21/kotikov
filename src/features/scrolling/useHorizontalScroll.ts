import { useEffect, useRef, useCallback } from "react";

interface UseHorizontalScrollOptions {
  enabled?: boolean;
  scrollMultiplier?: number;
}

export const useHorizontalScroll = (
  options: UseHorizontalScrollOptions = {}
) => {
  const { enabled = true, scrollMultiplier = 2 } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const checkScrollPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) return { canScrollLeft: false, canScrollRight: false };

    const tolerance = 5;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const maxScrollLeft = scrollWidth - clientWidth;

    const canScrollLeft = scrollLeft > tolerance;
    const canScrollRight = scrollLeft < maxScrollLeft - tolerance;

    return { canScrollLeft, canScrollRight };
  }, []);

  const smoothScrollTo = useCallback((targetScrollLeft: number) => {
    const container = containerRef.current;
    if (!container) return;

    const startScrollLeft = container.scrollLeft;
    const distance = targetScrollLeft - startScrollLeft;
    const duration = 150;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      container.scrollLeft = startScrollLeft + distance * easeOutQuart;
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(animateScroll);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const handleWheel = (e: WheelEvent) => {
      const { canScrollLeft, canScrollRight } = checkScrollPosition();
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;
      const shouldUseHorizontalScroll =
        (isScrollingDown && canScrollRight) || (isScrollingUp && canScrollLeft);

      if (shouldUseHorizontalScroll) {
        e.preventDefault();
        e.stopPropagation();
        const scrollAmount = e.deltaY * scrollMultiplier;
        const targetScrollLeft = container.scrollLeft + scrollAmount;
        smoothScrollTo(targetScrollLeft);
      } else {
        const scrollAmount = e.deltaY;
        window.scrollBy(0, scrollAmount);
        e.preventDefault();
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, scrollMultiplier, checkScrollPosition, smoothScrollTo]);

  return { containerRef, sectionRef };
};
