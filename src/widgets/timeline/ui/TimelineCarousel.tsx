"use client";

import type { TimelineItem } from "@/entities/timeline";
import { sectionTitles } from "@/shared/config/content";
import {
  BandCarousel,
  bandCarouselSlideClass,
  useBandCarousel,
} from "@/shared/ui/BandCarousel";

import { TimelineBandItem } from "./TimelineBandItem";

const PREV_LABEL = "Прокрутить к предыдущему этапу";
const NEXT_LABEL = "Прокрутить к следующему этапу";

interface TimelineCarouselProps {
  items: readonly TimelineItem[];
}

interface CarouselSlideProps {
  item: TimelineItem;
  isActive: boolean;
}

function CarouselSlide({ item, isActive }: CarouselSlideProps): React.JSX.Element {
  return (
    <div className={bandCarouselSlideClass(isActive)} aria-hidden={!isActive}>
      <TimelineBandItem item={item} />
    </div>
  );
}

/** Stacked-height slides + full-height chevrons — same chrome as the projects deck. */
export function TimelineCarousel({ items }: TimelineCarouselProps): React.JSX.Element {
  const controls = useBandCarousel({ count: items.length });

  return (
    <BandCarousel
      label={sectionTitles.experience}
      total={items.length}
      activeTitle={items[controls.activeIndex]?.title ?? ""}
      prevLabel={PREV_LABEL}
      nextLabel={NEXT_LABEL}
      controls={controls}
    >
      {items.map((item, index) => (
        <CarouselSlide key={item.id} item={item} isActive={index === controls.activeIndex} />
      ))}
    </BandCarousel>
  );
}
