"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import type { TimelineItem } from "@/entities/timeline";
import { usePerformanceSettings } from "@/features/performance";

import TimelineEditorialCard from "./TimelineEditorialCard";
import { getTimelineTypeNodeClass } from "./timelineTypeStyles";

interface TimelineEditorialRailProps {
  items: TimelineItem[];
}

const navButtonClass =
  "text-text-primary dark:text-text-inverse flex size-11 shrink-0 items-center justify-center border-2 border-black bg-white transition-opacity disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-white dark:bg-black";

const cardSlotClass =
  "flex w-[min(72vw,24rem)] shrink-0 snap-start flex-col sm:w-[24rem] lg:w-[26rem]";

const SCROLL_GAP_PX = 40;

const TimelineEditorialRail: React.FC<TimelineEditorialRailProps> = ({ items }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(items.length > 1);
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
      const delta = (card?.offsetWidth ?? 416) + SCROLL_GAP_PX;

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

  return (
    <div className="relative -mx-6 lg:-mx-8">
      <div className="mb-6 flex items-center gap-3 px-6 lg:px-8">
        <p className="text-text-secondary shrink-0 text-xs font-bold tracking-[0.22em] uppercase dark:text-neutral-400">
          Листай
          <span aria-hidden="true" className="text-primary-500 ml-1">
            →
          </span>
        </p>

        <div
          className="h-1 min-w-0 flex-1 overflow-hidden bg-black/10 dark:bg-white/15"
          aria-hidden="true"
        >
          <div
            className="bg-primary-500 h-full transition-[width] duration-200 ease-out motion-reduce:transition-none"
            style={{ width: `${String(progress)}%` }}
          />
        </div>

        <div
          role="toolbar"
          aria-label="Навигация по ленте этапов"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="flex shrink-0 gap-2"
        >
          <button
            type="button"
            onClick={() => {
              scrollByCard(-1);
            }}
            disabled={!canScrollLeft}
            aria-label="Прокрутить к предыдущему этапу"
            className={navButtonClass}
          >
            <FiChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              scrollByCard(1);
            }}
            disabled={!canScrollRight}
            aria-label="Прокрутить к следующему этапу"
            className={navButtonClass}
          >
            <FiChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          role="region"
          aria-label="Лента этапов опыта. Прокрутите горизонтально или используйте стрелки."
          className="snap-x snap-mandatory scrollbar-none overflow-x-auto overscroll-x-contain scroll-smooth px-6 pb-6 [-ms-overflow-style:none] motion-reduce:scroll-auto lg:px-8 [&::-webkit-scrollbar]:hidden"
        >
          <div className="relative flex items-start gap-10" role="list" aria-label="Этапы опыта">
            {items.map((item) => {
              const titleId = `timeline-entry-${String(item.id)}`;

              return (
                <div key={item.id} role="listitem" data-timeline-card className={cardSlotClass}>
                  <div className="mb-4 flex h-8 shrink-0 items-center justify-center">
                    <div
                      aria-hidden="true"
                      className={`size-4 border-2 border-black shadow-[2px_2px_0_0_#000] dark:border-white dark:shadow-[2px_2px_0_0_#fff] ${getTimelineTypeNodeClass(item.type)}`}
                    />
                  </div>

                  <TimelineEditorialCard
                    item={item}
                    titleId={titleId}
                    layout="stacked"
                    hover={false}
                  />
                </div>
              );
            })}

            <div aria-hidden="true" className="w-8 shrink-0 snap-none sm:w-12 lg:w-16" />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="from-background-primary dark:from-background-tertiary pointer-events-none absolute top-12 right-0 z-10 h-[calc(100%-3rem)] w-10 bg-linear-to-l to-transparent sm:w-16 lg:w-24"
        />
      </div>
    </div>
  );
};

export default TimelineEditorialRail;
