"use client";

import type { ReactNode } from "react";

import { CELL_HOVER, GRID_DIVIDE_X, GRID_STROKE_COLOR, GRID_SURFACE } from "../gridChrome";
import type { UseBandCarouselReturn } from "./useBandCarousel";

export const BAND_CAROUSEL_TRACK = `grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] ${GRID_DIVIDE_X}`;
export const BAND_CAROUSEL_SLIDES = "grid min-w-0";
export const BAND_CAROUSEL_SLIDE = "col-start-1 row-start-1 grid h-full min-h-0 min-w-0";

const CHEVRON_CLASS = `${GRID_SURFACE} ${CELL_HOVER} flex min-h-11 min-w-11 cursor-pointer items-center justify-center self-stretch px-3 font-black disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#111] dark:focus-visible:ring-[#ededed]`;
const REGION_CLASS = `border-t-2 ${GRID_STROKE_COLOR} outline-none focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-inset dark:focus-visible:ring-[#ededed]`;

export function bandCarouselSlideClass(isActive: boolean): string {
  if (isActive) return `visible ${BAND_CAROUSEL_SLIDE}`;
  return `invisible pointer-events-none ${BAND_CAROUSEL_SLIDE}`;
}

interface ChevronButtonProps {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  prevLabel: string;
  nextLabel: string;
}

function ChevronButton({
  direction,
  disabled,
  onClick,
  prevLabel,
  nextLabel,
}: ChevronButtonProps): React.JSX.Element {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? prevLabel : nextLabel}
      className={CHEVRON_CLASS}
    >
      <span aria-hidden="true">{isPrev ? "<<" : ">>"}</span>
    </button>
  );
}

function regionLabel(name: string, index: number, total: number): string {
  return `${name}, ${String(index + 1)} из ${String(total)}`;
}

function LiveStatus({
  index,
  title,
  total,
}: {
  index: number;
  title: string;
  total: number;
}): React.JSX.Element {
  return (
    <div className="sr-only" aria-atomic="true" aria-live="polite">
      {`${String(index + 1)} из ${String(total)}: ${title}`}
    </div>
  );
}

export interface BandCarouselProps {
  label: string;
  total: number;
  activeTitle: string;
  prevLabel: string;
  nextLabel: string;
  controls: UseBandCarouselReturn;
  testId?: string;
  children: ReactNode;
}

export function BandCarousel({
  label,
  total,
  activeTitle,
  prevLabel,
  nextLabel,
  controls,
  testId,
  children,
}: BandCarouselProps): React.JSX.Element {
  /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- spec: arrow keys on the focused carousel band */
  return (
    <div
      role="region"
      aria-roledescription="карусель"
      aria-label={regionLabel(label, controls.activeIndex, total)}
      tabIndex={0}
      data-testid={testId}
      onKeyDown={controls.handleKeyDown}
      onTouchStart={controls.handleTouchStart}
      onTouchEnd={controls.handleTouchEnd}
      onTouchCancel={controls.handleTouchCancel}
      className={REGION_CLASS}
    >
      <LiveStatus index={controls.activeIndex} title={activeTitle} total={total} />
      <div className={BAND_CAROUSEL_TRACK}>
        <ChevronButton
          direction="prev"
          disabled={!controls.canGoPrev}
          onClick={controls.goPrev}
          prevLabel={prevLabel}
          nextLabel={nextLabel}
        />
        <div className={BAND_CAROUSEL_SLIDES}>{children}</div>
        <ChevronButton
          direction="next"
          disabled={!controls.canGoNext}
          onClick={controls.goNext}
          prevLabel={prevLabel}
          nextLabel={nextLabel}
        />
      </div>
    </div>
  );
  /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
}
