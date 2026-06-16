"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import type { TimelineItem } from "@/entities/timeline";
import { usePerformanceSettings } from "@/features/performance";
import { timelineData as rawTimelineData } from "@/shared/config/content";
import { SWIPE_THRESHOLD_PX } from "@/shared/lib/gestures";
import { BauhausGridPattern } from "@/shared/ui";

import TimelineSlideContent from "./TimelineSlideContent";
import { getSlideClass, parsePeriodStart, timelineMotionClass } from "./timelineUtils";
import TimelineYearDisplay from "./TimelineYearDisplay";

const navButtonClass =
  "text-text-primary dark:text-text-inverse flex size-9 shrink-0 items-center justify-center border-2 border-black bg-white transition-opacity disabled:opacity-30 dark:border-white dark:bg-black";

/** Matches SkillsGroupedTags horizontal band (3 cards grid). */
const alignedContentBandClass = "mx-auto w-full max-w-5xl px-4";

const TimelineView: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const touchStartXRef = useRef<number | null>(null);
  const { reducedMotion } = usePerformanceSettings();
  const motionClass = reducedMotion ? "" : timelineMotionClass;

  const timelineData = useMemo(
    () =>
      [...rawTimelineData].sort((a, b) => {
        const byPeriod = parsePeriodStart(a.period) - parsePeriodStart(b.period);
        return byPeriod !== 0 ? byPeriod : a.id - b.id;
      }),
    []
  );

  const lastIndex = timelineData.length - 1;
  const activeItem = timelineData[activeIndex] as TimelineItem;
  const slideClass = getSlideClass(slideDirection, reducedMotion);
  const panelId = `timeline-panel-${String(activeItem.id)}`;

  const goTo = useCallback(
    (index: number): void => {
      setActiveIndex((current) => {
        const next = Math.max(0, Math.min(lastIndex, index));
        if (next !== current) {
          setSlideDirection(next > current ? 1 : -1);
        }
        return next;
      });
    },
    [lastIndex]
  );

  const goPrev = useCallback((): void => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const goNext = useCallback((): void => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
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

  return (
    <section
      id="experience"
      className="bg-background-primary dark:bg-background-tertiary relative overflow-x-hidden py-10 transition-colors duration-300 lg:py-12"
    >
      <BauhausGridPattern className="text-black dark:text-white" opacity={0.03} />

      <div
        className={`${alignedContentBandClass} relative z-10 flex flex-col gap-8 md:grid md:grid-cols-[22rem_minmax(0,1fr)] md:items-stretch md:gap-6 lg:grid-cols-[26rem_minmax(0,1fr)] lg:gap-8`}
        aria-roledescription="carousel"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex w-full flex-col items-center gap-4 md:items-stretch">
          <div className="w-full max-w-[26rem] md:max-w-none">
            <p className="text-primary-950 dark:text-primary-300 mb-2 text-sm font-bold tracking-[0.24em] uppercase">
              Опыт
            </p>
            <h2 className="text-text-primary dark:text-text-inverse text-3xl font-black tracking-tight uppercase md:text-4xl">
              Мой путь
            </h2>
            <p className="text-text-secondary mt-2 text-sm font-medium md:text-base dark:text-neutral-400">
              Образование, работа, хакатоны и личные проекты.
            </p>
          </div>

          <div className="flex w-full max-w-[26rem] justify-center md:max-w-none">
            <div
              className="relative h-[clamp(3.75rem,20vw,7.5rem)] w-full"
              aria-hidden="true"
            >
              <div
                key={activeItem.period}
                className={`absolute inset-0 flex items-center justify-center ${slideClass}`}
              >
                <TimelineYearDisplay period={activeItem.period} />
              </div>
            </div>
          </div>

          <p
            className="text-text-secondary w-full max-w-[26rem] text-center text-xs font-bold tracking-[0.2em] uppercase md:text-left dark:text-neutral-400"
            aria-live="polite"
          >
            {activeIndex + 1} / {timelineData.length}
          </p>

          <div className="flex w-full max-w-[26rem] items-center justify-center gap-2 md:justify-start">
            <button
              type="button"
              onClick={goPrev}
              disabled={activeIndex === 0}
              aria-label="Предыдущий этап"
              className={navButtonClass}
            >
              <FiChevronLeft className="size-4" aria-hidden="true" />
            </button>

            <div
              className="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto px-1 py-2 outline-none [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-primary-500 [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Этапы опыта"
              tabIndex={0}
              onKeyDown={handleKeyDown}
            >
              {timelineData.map((entry, index) => {
                const tabId = `timeline-tab-${String(entry.id)}`;
                const isActive = index === activeIndex;

                return (
                  <button
                    key={entry.id}
                    id={tabId}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={panelId}
                    aria-label={`${entry.title}, ${entry.period}`}
                    onClick={() => {
                      goTo(index);
                    }}
                    className={`h-2 min-w-6 shrink-0 rounded-none sm:min-w-7 ${motionClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                      isActive
                        ? "bg-black dark:bg-white"
                        : "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500"
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={activeIndex === lastIndex}
              aria-label="Следующий этап"
              className={navButtonClass}
            >
              <FiChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-col justify-center md:h-full">
          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={`timeline-tab-${String(activeItem.id)}`}
            className="relative w-full"
          >
            {timelineData.map((entry, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={entry.id}
                  className={
                    isActive
                      ? slideClass
                      : "pointer-events-none invisible absolute inset-x-0 top-0"
                  }
                  aria-hidden={!isActive}
                >
                  <TimelineSlideContent item={entry} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineView;
