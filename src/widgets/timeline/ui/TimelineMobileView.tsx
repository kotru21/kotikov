"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import type { TimelineItem } from "@/entities/timeline";
import { usePerformanceSettings } from "@/features/performance";
import {
  DECK_MOTION_CLASS,
  getDeckTransform,
  getLinearDeckCardRole,
} from "@/shared/lib/deckTransform";

import { useTimelineCarousel } from "../hooks/useTimelineCarousel";
import { timelineNavButtonClass } from "./timelineChrome";
import TimelineEditorialCard from "./TimelineEditorialCard";
import TimelineStepChips from "./TimelineStepChips";

interface TimelineMobileViewProps {
  items: TimelineItem[];
}

const TimelineMobileView: React.FC<TimelineMobileViewProps> = ({ items }) => {
  const { reducedMotion } = usePerformanceSettings();
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
  } = useTimelineCarousel({ itemCount: items.length });

  const panelId = "timeline-carousel-panel";
  const progressPercent = items.length > 1 ? (activeIndex / (items.length - 1)) * 100 : 100;
  const deckMotionClass = reducedMotion ? "" : DECK_MOTION_CLASS;

  return (
    <div className="flex w-full flex-col gap-5" data-testid="timeline-mobile">
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
          items={items}
          activeIndex={activeIndex}
          panelId={panelId}
          reducedMotion={reducedMotion}
          onSelect={goTo}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div
        id={panelId}
        role="group"
        aria-roledescription="этап карьеры"
        aria-label={`${String(activeIndex + 1)} из ${String(items.length)}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        className="grid w-full touch-pan-y pb-4 *:col-start-1 *:row-start-1"
      >
        {items.map((item, index) => {
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
          className={timelineNavButtonClass}
        >
          <FiChevronLeft className="size-5" aria-hidden="true" />
        </button>

        <p
          className="text-text-secondary min-w-12 flex-1 text-center text-xs font-bold tracking-[0.2em] uppercase dark:text-neutral-400"
          aria-live="polite"
        >
          {activeIndex + 1} / {items.length}
        </p>

        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext}
          aria-label="Следующий этап"
          className={timelineNavButtonClass}
        >
          <FiChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default TimelineMobileView;
