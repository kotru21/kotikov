import React from "react";

import type { TimelineItem } from "@/entities/timeline";
import { Card } from "@/shared/ui";

import TimelineItemDetails from "./TimelineItemDetails";
import { getTimelineTypeAccentBarClass, getTimelineTypeSurfaceClass } from "./timelineTypeStyles";
import TimelineYearDisplay from "./TimelineYearDisplay";

interface TimelineEditorialCardProps {
  item: TimelineItem;
  titleId: string;
  fillHeight?: boolean;
  hover?: boolean;
}

const TimelineEditorialCard: React.FC<TimelineEditorialCardProps> = ({
  item,
  titleId,
  fillHeight = false,
  hover = true,
}) => {
  return (
    <Card
      padding="none"
      hover={hover}
      className={`relative bg-linear-to-br ${getTimelineTypeSurfaceClass(item.type)} min-h-80 xl:min-h-[22rem] ${fillHeight ? "h-full" : ""}`}
    >
      <div
        aria-hidden="true"
        className={`absolute top-0 left-0 h-full w-1 ${getTimelineTypeAccentBarClass(item.type)}`}
      />

      <div className="relative z-10 flex h-full flex-col gap-4 p-5 sm:p-6">
        <div className="border-b border-black/10 pb-3 dark:border-white/10">
          <TimelineYearDisplay period={item.period} />
        </div>

        <TimelineItemDetails item={item} titleId={titleId} />
      </div>
    </Card>
  );
};

export default TimelineEditorialCard;
