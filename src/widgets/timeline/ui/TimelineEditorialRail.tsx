"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import type { TimelineItem } from "@/entities/timeline";

import { useTimelineEditorialRail } from "../hooks/useTimelineEditorialRail";
import { timelineNavButtonClass } from "./timelineChrome";
import TimelineEditorialCard from "./TimelineEditorialCard";
import { getTimelineTypeNodeClass } from "./timelineTypeStyles";

interface TimelineEditorialRailProps {
  items: TimelineItem[];
}

const cardSlotClass =
  "flex w-[min(72vw,24rem)] shrink-0 snap-start flex-col sm:w-[24rem] lg:w-[26rem]";

const TimelineEditorialRail: React.FC<TimelineEditorialRailProps> = ({ items }) => {
  const {
    scrollerRef,
    progress,
    canScrollLeft,
    canScrollRight,
    scrollByCard,
    handleKeyDown,
  } = useTimelineEditorialRail(items.length);

  return (
    <div className="relative md:px-2 lg:-mx-8 lg:px-0">
      <div className="mb-4 flex items-center gap-3 lg:px-8">
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
            className={timelineNavButtonClass}
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
            className={timelineNavButtonClass}
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
          className="snap-x snap-mandatory scrollbar-none overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [-ms-overflow-style:none] motion-reduce:scroll-auto lg:px-8 [&::-webkit-scrollbar]:hidden"
        >
          <div className="relative flex items-start gap-10" role="list" aria-label="Этапы опыта">
            {items.map((item) => {
              const titleId = `timeline-entry-${String(item.id)}`;

              return (
                <div key={item.id} role="listitem" data-timeline-card className={cardSlotClass}>
                  <div className="mb-3 flex h-6 shrink-0 items-center justify-center">
                    <div
                      aria-hidden="true"
                      className={`size-4 border-2 border-black shadow-[2px_2px_0_0_#000] dark:border-white dark:shadow-[2px_2px_0_0_#fff] ${getTimelineTypeNodeClass(item.type)}`}
                    />
                  </div>

                  <TimelineEditorialCard item={item} titleId={titleId} hover={false} />
                </div>
              );
            })}

            <div aria-hidden="true" className="w-8 shrink-0 snap-none sm:w-12 lg:w-16" />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="from-background-primary dark:from-background-tertiary pointer-events-none absolute top-9 right-0 z-10 h-[calc(100%-2.25rem)] w-10 bg-linear-to-l to-transparent sm:w-16 lg:w-24"
        />
      </div>
    </div>
  );
};

export default TimelineEditorialRail;
