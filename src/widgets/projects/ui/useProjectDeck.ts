"use client";

import { useCallback, useRef, useState } from "react";

import { SWIPE_THRESHOLD_PX } from "@/shared/lib/gestures";

import { getWrappedIndex } from "./getDeckTransform";

interface UseProjectDeckOptions {
  count: number;
}

interface UseProjectDeckReturn {
  activeIndex: number;
  goTo: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  handleTouchStart: (event: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchEnd: (event: React.TouchEvent<HTMLDivElement>) => void;
}

export const useProjectDeck = ({ count }: UseProjectDeckOptions): UseProjectDeckReturn => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const lastIndex = count - 1;

  const goTo = useCallback(
    (index: number): void => {
      if (count <= 0) return;
      setActiveIndex(((index % count) + count) % count);
    },
    [count]
  );

  const goNext = useCallback((): void => {
    setActiveIndex((current) => getWrappedIndex(current, 1, count));
  }, [count]);

  const goPrev = useCallback((): void => {
    setActiveIndex((current) => getWrappedIndex(current, -1, count));
  }, [count]);

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

  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>): void => {
    if (event.touches.length === 0) return;
    touchStartXRef.current = event.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent<HTMLDivElement>): void => {
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
    goNext,
    goPrev,
    handleKeyDown,
    handleTouchStart,
    handleTouchEnd,
  };
};
