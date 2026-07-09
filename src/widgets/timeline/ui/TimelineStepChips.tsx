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

const activeChipShellClass = "shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#fff]";

const chipMotionClass = "transition-[box-shadow,background-color,border-color,color] duration-200";

const NAVIGATION_KEYS = new Set(["ArrowLeft", "ArrowRight", "Home", "End"]);

function willTimelineIndexChange(key: string, activeIndex: number, itemCount: number): boolean {
  const lastIndex = itemCount - 1;
  if (key === "ArrowLeft" || key === "Home") return activeIndex > 0;
  if (key === "ArrowRight" || key === "End") return activeIndex < lastIndex;
  return false;
}

const TimelineStepChips: React.FC<TimelineStepChipsProps> = ({
  items,
  activeIndex,
  panelId,
  reducedMotion,
  onSelect,
  onKeyDown,
}) => {
  const controlsRef = useRef<HTMLDivElement>(null);
  const prevActiveIndexRef = useRef<number | null>(null);
  const shouldFocusActiveControlRef = useRef(false);
  const motionClass = reducedMotion ? "duration-0" : chipMotionClass;

  useEffect(() => {
    const controls = controlsRef.current;
    if (controls === null) return;

    if (prevActiveIndexRef.current === null) {
      prevActiveIndexRef.current = activeIndex;
      return;
    }

    if (prevActiveIndexRef.current === activeIndex) return;
    prevActiveIndexRef.current = activeIndex;

    const activeChip = controls.querySelector<HTMLElement>(
      `[data-timeline-chip-index="${String(activeIndex)}"]`
    );
    if (activeChip === null) return;

    if (shouldFocusActiveControlRef.current) {
      shouldFocusActiveControlRef.current = false;
      activeChip.focus();
    }

    const controlsRect = controls.getBoundingClientRect();
    const chipRect = activeChip.getBoundingClientRect();
    const overflowLeft = chipRect.left - controlsRect.left;
    const overflowRight = chipRect.right - controlsRect.right;

    if (overflowLeft < 0) {
      controls.scrollLeft += overflowLeft;
    } else if (overflowRight > 0) {
      controls.scrollLeft += overflowRight;
    }
  }, [activeIndex]);

  const handleControlsKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const isNavigationKey = onKeyDown !== undefined && NAVIGATION_KEYS.has(event.key);
    if (isNavigationKey) shouldFocusActiveControlRef.current = true;
    onKeyDown?.(event);
    if (isNavigationKey && !willTimelineIndexChange(event.key, activeIndex, items.length)) {
      shouldFocusActiveControlRef.current = false;
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- handles keyboard events bubbled from the native timeline buttons
    <div
      ref={controlsRef}
      role="group"
      aria-label="Этапы опыта"
      onKeyDown={handleControlsKeyDown}
      className="flex w-full snap-x snap-mandatory scrollbar-none gap-2 overflow-x-auto [-ms-overflow-style:none] lg:snap-none lg:flex-col lg:gap-2 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
    >
      {items.map((entry, index) => {
        const isActive = index === activeIndex;
        const label = getTypeLabel(entry.type);
        const chipAriaLabel = `${extractYear(entry.period)} · ${label}`;
        const typeAccent = getTimelineTypeChipClass(entry.type, isActive);
        const typeBorder = isActive ? "" : getTimelineTypeChipBorderClass(entry.type);

        return (
          <button
            key={entry.id}
            type="button"
            data-timeline-chip-index={index}
            aria-pressed={isActive}
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
