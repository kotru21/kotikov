"use client";

import React, { useMemo } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import type { TimelineItem } from "@/entities/timeline";
import { usePerformanceSettings } from "@/features/performance";
import { timelineData as rawTimelineData } from "@/shared/config/content";
import {
  DECK_MOTION_CLASS,
  getDeckTransform,
  getLinearDeckCardRole,
} from "@/shared/lib/deckTransform";
import { BauhausGridPattern, Section, SectionHeader } from "@/shared/ui";

import { useTimelineCarousel } from "../hooks/useTimelineCarousel";
import TimelineEditorialCard from "./TimelineEditorialCard";
import TimelineEditorialRail from "./TimelineEditorialRail";
import TimelineStepChips from "./TimelineStepChips";
import { parsePeriodStart } from "./timelineUtils";

const navButtonClass =
  "text-text-primary dark:text-text-inverse flex size-11 shrink-0 items-center justify-center border-2 border-black bg-white transition-opacity disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-white dark:bg-black";

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
    handleTouchCancel,
    canGoPrev,
    canGoNext,
  } = useTimelineCarousel({ itemCount: timelineData.length });

  const activeItem = timelineData[activeIndex] as TimelineItem;
  const panelId = "timeline-carousel-panel";
  const progressPercent =
    timelineData.length > 1 ? (activeIndex / (timelineData.length - 1)) * 100 : 100;
  const deckMotionClass = reducedMotion ? "" : DECK_MOTION_CLASS;

  return (
    <Section
      id="experience"
      backgroundClassName="bg-background-primary dark:bg-background-tertiary"
      className="lg:overflow-x-clip"
      innerClassName="relative z-10"
    >
      <BauhausGridPattern className="text-black dark:text-white" opacity={0.03} />

      <div className="flex w-full flex-col gap-8">
        <SectionHeader
          eyebrow="Опыт"
          title="Мой путь"
          titleId="experience-heading"
          description="Образование, работа и хакатоны"
        />

        <div className="flex flex-col gap-6 lg:hidden">
          <div className="flex w-full flex-col gap-3">
            <div
              className="h-1 w-full overflow-hidden bg-black/10 dark:bg-white/15"
              aria-hidden="true"
            >
              <div
                className="bg-primary-500 h-full transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{ width: `${String(progressPercent)}%` }}
              />
            </div>

            <TimelineStepChips
              items={timelineData}
              activeIndex={activeIndex}
              panelId={panelId}
              reducedMotion={reducedMotion}
              onSelect={goTo}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={`timeline-tab-${String(activeItem.id)}`}
            aria-label="Свайпните влево или вправо для переключения этапа"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            className="grid w-full touch-pan-y pb-8 *:col-start-1 *:row-start-1"
          >
            {timelineData.map((item, index) => {
              const role = getLinearDeckCardRole(index, activeIndex);
              const deckStyle = getDeckTransform(role, reducedMotion);
              const isActive = deckStyle.isActive;

              return (
                <div
                  key={item.id}
                  aria-hidden={!isActive}
                  {...(!isActive ? { inert: true } : {})}
                  className={`col-start-1 row-start-1 w-full origin-center ${deckMotionClass}`}
                  style={{
                    zIndex: deckStyle.zIndex,
                    transform: deckStyle.transform,
                    opacity: deckStyle.opacity,
                  }}
                >
                  <div className={isActive ? undefined : "pointer-events-none"}>
                    <TimelineEditorialCard
                      item={item}
                      titleId={`timeline-entry-${String(item.id)}`}
                      layout="stacked"
                      fillHeight
                      hover={false}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex w-full items-center gap-2">
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
              className="text-text-secondary min-w-12 flex-1 text-center text-xs font-bold tracking-[0.2em] uppercase dark:text-neutral-400"
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
        </div>

        <div className="hidden lg:block">
          <TimelineEditorialRail items={timelineData} />
        </div>
      </div>
    </Section>
  );
};

export default TimelineView;
