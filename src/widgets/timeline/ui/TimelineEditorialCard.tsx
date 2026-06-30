import React from "react";

import type { TimelineItem } from "@/entities/timeline";
import { Card } from "@/shared/ui";

import TimelineItemDetails from "./TimelineItemDetails";
import {
  getTimelineTypeAccentBarClass,
  getTimelineTypeSurfaceClass,
} from "./timelineTypeStyles";
import TimelineYearDisplay from "./TimelineYearDisplay";

interface TimelineEditorialCardProps {
  item: TimelineItem;
  titleId: string;
  layout?: "inline" | "stacked";
  compact?: boolean;
  fillHeight?: boolean;
  hover?: boolean;
}

const TimelineEditorialCard: React.FC<TimelineEditorialCardProps> = ({
  item,
  titleId,
  layout = "inline",
  compact = false,
  fillHeight = false,
  hover = true,
}) => {
  const isStacked = layout === "stacked";

  return (
    <Card
      padding="none"
      hover={hover}
      className={`relative bg-linear-to-br ${getTimelineTypeSurfaceClass(item.type)} ${isStacked ? "min-h-80 xl:min-h-[22rem]" : ""} ${fillHeight ? "h-full" : ""}`}
    >
      <div
        aria-hidden="true"
        className={`absolute top-0 left-0 h-full w-1 ${getTimelineTypeAccentBarClass(item.type)}`}
      />

      <div
        className={`relative z-10 flex h-full flex-col ${
          isStacked
            ? "gap-4 p-5 sm:p-6"
            : "grid grid-cols-1 gap-5 overflow-hidden p-5 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-6 sm:p-6 lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-8 lg:p-7"
        }`}
      >
        <div
          className={
            isStacked
              ? "border-black/10 border-b pb-3 dark:border-white/10"
              : "border-black/10 sm:border-r sm:pr-5 dark:border-white/15"
          }
        >
          <TimelineYearDisplay period={item.period} layout="row" />
        </div>

        <TimelineItemDetails item={item} titleId={titleId} compact={compact} />
      </div>
    </Card>
  );
};

export default TimelineEditorialCard;
