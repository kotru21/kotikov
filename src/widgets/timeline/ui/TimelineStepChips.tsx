"use client";

import React, { useEffect, useRef } from "react";

import type { TimelineItem } from "@/entities/timeline";

import { getTimelineTypeChipBorderClass, getTimelineTypeChipClass } from "./timelineTypeStyles";
import { extractYear, getTypeLabel } from "./timelineUtils";

interface TimelineStepChipsProps {
  items: TimelineItem[];
  activeIndex: number;
  panelId: string;
  reducedMotion: boolean;
  onSelect: (index: number) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

const baseChipClass =
  "min-h-11 w-full shrink-0 border-2 border-black bg-white px-3 py-2.5 text-left text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-white lg:bg-background-primary lg:dark:bg-neutral-900";

const inactiveChipClass =
  "bg-white text-text-primary dark:bg-black dark:text-text-inverse lg:bg-background-primary lg:dark:bg-neutral-900";

const activeChipShellClass =
  "shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#fff]";

const chipMotionClass =
  "transition-[box-shadow,background-color,border-color,color] duration-200";

const TimelineStepChips: React.FC<TimelineStepChipsProps> = ({
  items,
  activeIndex,
  panelId,
  reducedMotion,
  onSelect,
  onKeyDown,
}) => {
  const tablistRef = useRef<HTMLDivElement>(null);
  const prevActiveIndexRef = useRef<number | null>(null);
  const motionClass = reducedMotion ? "duration-0" : chipMotionClass;

  useEffect(() => {
    const tablist = tablistRef.current;
    if (tablist === null) return;

    if (prevActiveIndexRef.current === null) {
      prevActiveIndexRef.current = activeIndex;
      return;
    }

    if (prevActiveIndexRef.current === activeIndex) return;
    prevActiveIndexRef.current = activeIndex;

    const activeTab = tablist.querySelector<HTMLElement>(
      `[data-timeline-chip-index="${String(activeIndex)}"]`
    );
    if (activeTab === null) return;

    const tablistRect = tablist.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    const overflowLeft = tabRect.left - tablistRect.left;
    const overflowRight = tabRect.right - tablistRect.right;

    if (overflowLeft < 0) {
      tablist.scrollLeft += overflowLeft;
    } else if (overflowRight > 0) {
      tablist.scrollLeft += overflowRight;
    }
  }, [activeIndex]);

  return (
    <div
      ref={tablistRef}
      role="tablist"
      aria-label="Этапы опыта"
      tabIndex={onKeyDown === undefined ? undefined : 0}
      onKeyDown={onKeyDown}
      className={`flex w-full gap-2 overflow-x-auto [scrollbar-width:none] snap-x snap-mandatory [-ms-overflow-style:none] lg:flex-col lg:overflow-visible lg:snap-none lg:gap-2 [&::-webkit-scrollbar]:hidden${
        onKeyDown === undefined
          ? ""
          : " outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      }`}
    >
      {items.map((entry, index) => {
        const isActive = index === activeIndex;
        const tabId = `timeline-tab-${String(entry.id)}`;
        const label = getTypeLabel(entry.type);
        const chipAriaLabel = `${extractYear(entry.period)} · ${label}`;
        const typeAccent = getTimelineTypeChipClass(entry.type, isActive);
        const typeBorder = isActive ? "" : getTimelineTypeChipBorderClass(entry.type);

        return (
          <button
            key={entry.id}
            id={tabId}
            type="button"
            role="tab"
            data-timeline-chip-index={index}
            aria-selected={isActive}
            aria-controls={panelId}
            aria-label={chipAriaLabel}
            onClick={() => {
              onSelect(index);
            }}
            className={`snap-center lg:snap-align-none ${baseChipClass} ${motionClass} lg:w-full ${
              isActive
                ? `${activeChipShellClass} ${typeAccent}`
                : `${inactiveChipClass} ${typeBorder}`
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
