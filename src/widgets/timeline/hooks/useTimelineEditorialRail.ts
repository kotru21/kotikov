"use client";

import { type RefObject,useCallback, useEffect, useRef, useState } from "react";

import { usePerformanceSettings } from "@/features/performance";

export const TIMELINE_RAIL_SCROLL_GAP_PX = 40;

interface UseTimelineEditorialRailReturn {
  scrollerRef: RefObject<HTMLDivElement | null>;
  progress: number;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollByCard: (direction: -1 | 1) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

export function useTimelineEditorialRail(itemCount: number): UseTimelineEditorialRailReturn {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(itemCount > 1);
  const { reducedMotion } = usePerformanceSettings();

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (scroller === null) return;

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    setProgress(maxScroll > 0 ? (scroller.scrollLeft / maxScroll) * 100 : 100);
    setCanScrollLeft(scroller.scrollLeft > 8);
    setCanScrollRight(scroller.scrollLeft < maxScroll - 8);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller === null) return;

    updateScrollState();
    scroller.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      scroller.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByCard = useCallback(
    (direction: -1 | 1) => {
      const scroller = scrollerRef.current;
      if (scroller === null) return;

      const card = scroller.querySelector<HTMLElement>("[data-timeline-card]");
      const delta = (card?.offsetWidth ?? 416) + TIMELINE_RAIL_SCROLL_GAP_PX;

      scroller.scrollBy({
        left: direction * delta,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [reducedMotion]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollByCard(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollByCard(-1);
      }
    },
    [scrollByCard]
  );

  return {
    scrollerRef,
    progress,
    canScrollLeft,
    canScrollRight,
    scrollByCard,
    handleKeyDown,
  };
}
