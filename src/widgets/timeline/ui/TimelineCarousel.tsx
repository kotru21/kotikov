"use client";

import type { TimelineItem } from "@/entities/timeline";
import { sectionTitles } from "@/shared/config/content";
import { CELL_HOVER, GRID_SURFACE } from "@/shared/ui";

import { useTimelineCarousel } from "../hooks/useTimelineCarousel";
import { TimelineBandItem } from "./TimelineBandItem";

const PREV_LABEL = "Прокрутить к предыдущему этапу";
const NEXT_LABEL = "Прокрутить к следующему этапу";
/** One cell: row height is max-content of every slide, including `invisible` copies. */
const SLIDE_CELL = "col-start-1 row-start-1 grid";

type CarouselControls = ReturnType<typeof useTimelineCarousel>;

interface TimelineCarouselProps {
  items: readonly TimelineItem[];
  strokeClassName: string;
}

interface ChevronButtonProps {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}

function ChevronButton({ direction, disabled, onClick }: ChevronButtonProps): React.JSX.Element {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? PREV_LABEL : NEXT_LABEL}
      className={`${GRID_SURFACE} ${CELL_HOVER} flex min-h-11 min-w-11 cursor-pointer items-center justify-center px-4 font-black disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#111] dark:focus-visible:ring-[#ededed]`}
    >
      <span aria-hidden="true">{isPrev ? "<<" : ">>"}</span>
    </button>
  );
}

function slideClassName(isActive: boolean): string {
  if (isActive) return `visible ${SLIDE_CELL}`;
  return `invisible pointer-events-none ${SLIDE_CELL}`;
}

function carouselRegionLabel(name: string, index: number, total: number): string {
  return `${name}, ${String(index + 1)} из ${String(total)}`;
}

function CarouselLiveStatus({
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

interface CarouselSlideProps {
  item: TimelineItem;
  isActive: boolean;
  strokeClassName: string;
}

function CarouselSlide({ item, isActive, strokeClassName }: CarouselSlideProps): React.JSX.Element {
  return (
    <div className={slideClassName(isActive)} aria-hidden={!isActive}>
      <TimelineBandItem item={item} strokeClassName={strokeClassName} />
    </div>
  );
}

interface CarouselSlidesProps {
  items: readonly TimelineItem[];
  activeIndex: number;
  strokeClassName: string;
}

function CarouselSlides({
  items,
  activeIndex,
  strokeClassName,
}: CarouselSlidesProps): React.JSX.Element {
  return (
    <div className="grid">
      {items.map((item, index) => (
        <CarouselSlide
          key={item.id}
          item={item}
          isActive={index === activeIndex}
          strokeClassName={strokeClassName}
        />
      ))}
    </div>
  );
}

interface CarouselChromeProps {
  items: readonly TimelineItem[];
  controls: CarouselControls;
  strokeClassName: string;
}

function CarouselTrack({
  items,
  controls,
  strokeClassName,
}: CarouselChromeProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-[auto_1fr_auto]">
      <ChevronButton direction="prev" disabled={!controls.canGoPrev} onClick={controls.goPrev} />
      <CarouselSlides
        items={items}
        activeIndex={controls.activeIndex}
        strokeClassName={strokeClassName}
      />
      <ChevronButton direction="next" disabled={!controls.canGoNext} onClick={controls.goNext} />
    </div>
  );
}

function CarouselBand({
  items,
  controls,
  strokeClassName,
}: CarouselChromeProps): React.JSX.Element {
  /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- spec: arrow keys on the focused carousel band */
  return (
    <div
      role="region"
      aria-roledescription="карусель"
      aria-label={carouselRegionLabel(
        sectionTitles.experience,
        controls.activeIndex,
        items.length
      )}
      tabIndex={0}
      onKeyDown={controls.handleKeyDown}
      onTouchStart={controls.handleTouchStart}
      onTouchEnd={controls.handleTouchEnd}
      onTouchCancel={controls.handleTouchCancel}
      className="outline-none focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-inset dark:focus-visible:ring-[#ededed]"
    >
      <CarouselLiveStatus
        index={controls.activeIndex}
        title={items[controls.activeIndex]?.title ?? ""}
        total={items.length}
      />
      <CarouselTrack items={items} controls={controls} strokeClassName={strokeClassName} />
    </div>
  );
  /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
}

/** Shared stacked-height slides + chevrons for desktop and mobile timeline. */
export function TimelineCarousel({
  items,
  strokeClassName,
}: TimelineCarouselProps): React.JSX.Element {
  const controls = useTimelineCarousel({ itemCount: items.length });
  return <CarouselBand items={items} controls={controls} strokeClassName={strokeClassName} />;
}
