"use client";

import { useCallback, useRef, useState } from "react";

import { SWIPE_THRESHOLD_PX } from "@/shared/lib/gestures";

interface UseTimelineCarouselOptions {
  itemCount: number;
}

interface UseTimelineCarouselReturn {
  activeIndex: number;
  goTo: (index: number) => void;
  goPrev: () => void;
  goNext: () => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  handleTouchStart: (event: React.TouchEvent) => void;
  handleTouchEnd: (event: React.TouchEvent) => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export function useTimelineCarousel({
  itemCount,
}: UseTimelineCarouselOptions): UseTimelineCarouselReturn {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const lastIndex = Math.max(0, itemCount - 1);

  const goTo = useCallback(
    (index: number): void => {
      if (itemCount <= 0) return;
      setActiveIndex(Math.max(0, Math.min(lastIndex, index)));
    },
    [itemCount, lastIndex]
  );

  const goPrev = useCallback((): void => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const goNext = useCallback((): void => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent): void => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(lastIndex);
      }
    },
    [goPrev, goNext, goTo, lastIndex]
  );

  const handleTouchStart = useCallback((event: React.TouchEvent): void => {
    if (event.touches.length === 0) return;
    touchStartXRef.current = event.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent): void => {
      const startX = touchStartXRef.current;
      touchStartXRef.current = null;
      if (startX === null) return;
      if (event.changedTouches.length === 0) return;

      const delta = event.changedTouches[0].clientX - startX;
      if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;

      if (delta > 0) {
        goPrev();
      } else {
        goNext();
      }
    },
    [goPrev, goNext]
  );

  return {
    activeIndex,
    goTo,
    goPrev,
    goNext,
    handleKeyDown,
    handleTouchStart,
    handleTouchEnd,
    canGoPrev: activeIndex > 0,
    canGoNext: activeIndex < lastIndex,
  };
}
