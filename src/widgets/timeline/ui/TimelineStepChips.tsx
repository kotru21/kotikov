"use client";

import React, { useEffect, useRef } from "react";

import type { TimelineItem } from "@/entities/timeline";

import { getTimelineTypeChipClass } from "./timelineTypeStyles";
import { extractYear, getTypeLabel } from "./timelineUtils";

interface TimelineStepChipsProps {
  items: TimelineItem[];
  activeIndex: number;
  panelId: string;
  reducedMotion: boolean;
  onSelect: (index: number) => void;
}

const baseChipClass =
  "min-h-11 shrink-0 border-2 border-black bg-white px-3 py-2 text-xs font-bold text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-white dark:bg-black dark:text-text-inverse";

const inactiveChipClass = "";

const activeChipShellClass =
  "shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#fff]";

const chipMotionClass = "transition-[box-shadow,background-color] duration-200";

const TimelineStepChips: React.FC<TimelineStepChipsProps> = ({
  items,
  activeIndex,
  panelId,
  reducedMotion,
  onSelect,
}) => {
  const tablistRef = useRef<HTMLDivElement>(null);
  const motionClass = reducedMotion ? "duration-0" : chipMotionClass;

  useEffect(() => {
    const tablist = tablistRef.current;
    if (tablist === null) return;

    const activeTab = tablist.querySelector<HTMLElement>(
      `[data-timeline-chip-index="${activeIndex}"]`
    );
    activeTab?.scrollIntoView?.({
      inline: "nearest",
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [activeIndex, reducedMotion]);

  return (
    <div
      ref={tablistRef}
      role="tablist"
      aria-label="Этапы опыта"
      className="flex gap-2 overflow-x-auto [scrollbar-width:none] snap-x snap-mandatory [-ms-overflow-style:none] md:flex-col md:overflow-visible md:snap-none [&::-webkit-scrollbar]:hidden"
    >
      {items.map((entry, index) => {
        const isActive = index === activeIndex;
        const tabId = `timeline-tab-${String(entry.id)}`;
        const label = `${extractYear(entry.period)} · ${getTypeLabel(entry.type)}`;
        const typeAccent = getTimelineTypeChipClass(entry.type, isActive);

        return (
          <button
            key={entry.id}
            id={tabId}
            type="button"
            role="tab"
            data-timeline-chip-index={index}
            aria-selected={isActive}
            aria-controls={panelId}
            aria-label={label}
            onClick={() => {
              onSelect(index);
            }}
            className={`snap-center md:snap-align-none ${baseChipClass} ${motionClass} md:w-full ${
              isActive ? `${activeChipShellClass} ${typeAccent}` : inactiveChipClass
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default TimelineStepChips;
