"use client";

import { useCallback, useRef, useState } from "react";

import { SWIPE_THRESHOLD_PX } from "@/shared/lib";

interface TouchStartPoint {
  x: number;
  y: number;
}

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
  handleTouchCancel: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

function shouldIgnoreSwipeTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return true;

  return Boolean(
    target.closest(
      "a,button,input,textarea,select,label,[role='button'],[role='link'],[role='tab']"
    )
  );
}

export function useTimelineCarousel({
  itemCount,
}: UseTimelineCarouselOptions): UseTimelineCarouselReturn {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartRef = useRef<TouchStartPoint | null>(null);
  const lastIndex = Math.max(0, itemCount - 1);

  const goTo = useCallback(
    (index: number): void => {
      if (itemCount <= 0) return;
      setActiveIndex(Math.max(0, Math.min(lastIndex, index)));
    },
    [itemCount, lastIndex]
  );

  const goPrev = useCallback((): void => {
    setActiveIndex((current) => Math.max(0, current - 1));
  }, []);

  const goNext = useCallback((): void => {
    setActiveIndex((current) => Math.min(lastIndex, current + 1));
  }, [lastIndex]);

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
    if (event.touches.length !== 1) return;
    if (shouldIgnoreSwipeTarget(event.target)) return;

    touchStartRef.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }, []);

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent): void => {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (start === null) return;
      if (event.changedTouches.length === 0) return;

      const deltaX = event.changedTouches[0].clientX - start.x;
      const deltaY = event.changedTouches[0].clientY - start.y;

      if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;

      if (deltaX > 0) {
        goPrev();
      } else {
        goNext();
      }
    },
    [goPrev, goNext]
  );

  const handleTouchCancel = useCallback((): void => {
    touchStartRef.current = null;
  }, []);

  return {
    activeIndex,
    goTo,
    goPrev,
    goNext,
    handleKeyDown,
    handleTouchStart,
    handleTouchEnd,
    handleTouchCancel,
    canGoPrev: activeIndex > 0,
    canGoNext: activeIndex < lastIndex,
  };
}
