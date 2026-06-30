"use client";

import React, { useMemo } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import type { TimelineItem } from "@/entities/timeline";
import { usePerformanceSettings } from "@/features/performance";
import { timelineData as rawTimelineData } from "@/shared/config/content";
import { BauhausGridPattern, Section, SectionHeader } from "@/shared/ui";

import { useTimelineCarousel } from "../hooks/useTimelineCarousel";
import TimelineSlideContent from "./TimelineSlideContent";
import TimelineStepChips from "./TimelineStepChips";
import { parsePeriodStart } from "./timelineUtils";
import TimelineYearDisplay from "./TimelineYearDisplay";

const navButtonClass =
  "text-text-primary dark:text-text-inverse flex size-11 shrink-0 items-center justify-center border-2 border-black bg-white transition-opacity disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-white dark:bg-black";

const alignedContentBandClass = "mx-auto w-full max-w-5xl";

const TimelineView: React.FC = () => {
  const { reducedMotion } = usePerformanceSettings();

  const timelineData = useMemo(
    () =>
      [...rawTimelineData].sort((a, b) => {
        const byPeriod = parsePeriodStart(a.period) - parsePeriodStart(b.period);
        return byPeriod !== 0 ? byPeriod : a.id - b.id;
      }),
    []
  );

  const {
    activeIndex,
    goTo,
    goPrev,
    goNext,
    handleKeyDown,
    handleTouchStart,
    handleTouchEnd,
    canGoPrev,
    canGoNext,
  } = useTimelineCarousel({ itemCount: timelineData.length });

  const activeItem = timelineData[activeIndex] as TimelineItem;
  const panelId = `timeline-panel-${String(activeItem.id)}`;

  return (
    <Section
      id="experience"
      backgroundClassName="bg-background-primary dark:bg-background-tertiary"
      className="overflow-x-hidden"
      innerClassName="relative z-10"
    >
      <BauhausGridPattern className="text-black dark:text-white" opacity={0.03} />

      <div className={`${alignedContentBandClass} flex flex-col gap-8`}>
        <SectionHeader
          eyebrow="Опыт"
          title="Мой путь"
          titleId="experience-heading"
          description="Образование, работа и хакатоны"
        />

        <div
          className="flex flex-col gap-6 md:grid md:grid-cols-[18rem_minmax(0,1fr)] md:items-stretch md:gap-6"
          aria-roledescription="carousel"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <aside className="flex flex-col items-center gap-4 md:items-stretch">
            <div className="flex w-full justify-center md:justify-start">
              <TimelineYearDisplay period={activeItem.period} />
            </div>

            <TimelineStepChips
                items={timelineData}
                activeIndex={activeIndex}
                panelId={panelId}
                reducedMotion={reducedMotion}
                onSelect={goTo}
                onKeyDown={handleKeyDown}
              />

            <div className="flex w-full items-center justify-center gap-2 md:justify-start">
              <button
                type="button"
                onClick={goPrev}
                disabled={!canGoPrev}
                aria-label="Предыдущий этап"
                className={navButtonClass}
              >
                <FiChevronLeft className="size-5" aria-hidden="true" />
              </button>

              <p
                className="text-text-secondary min-w-[3rem] text-center text-xs font-bold tracking-[0.2em] uppercase dark:text-neutral-400"
                aria-live="polite"
              >
                {activeIndex + 1} / {timelineData.length}
              </p>

              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext}
                aria-label="Следующий этап"
                className={navButtonClass}
              >
                <FiChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </aside>

          <main className="flex min-h-0 min-w-0 flex-col justify-center md:h-full">
            <div
              id={panelId}
              role="tabpanel"
              aria-labelledby={`timeline-tab-${String(activeItem.id)}`}
              className="grid w-full md:relative [&>*]:col-start-1 [&>*]:row-start-1"
            >
              {timelineData.map((entry, index) => {
                const isActive = index === activeIndex;

                return (
                  <div
                    key={entry.id}
                    inert={isActive ? undefined : true}
                    className={
                      isActive
                        ? "col-start-1 row-start-1"
                        : "pointer-events-none invisible col-start-1 row-start-1 opacity-0"
                    }
                    aria-hidden={!isActive}
                  >
                    <TimelineSlideContent item={entry} />
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </Section>
  );
};

export default TimelineView;
