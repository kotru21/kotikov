import React from "react";

import type { TimelineItem } from "@/entities/timeline";

import { getTimelineTypeEyebrowClass } from "./timelineTypeStyles";
import { getTypeLabel } from "./timelineUtils";

interface TimelineItemDetailsProps {
  item: TimelineItem;
  titleId?: string;
  compact?: boolean;
}

const techPillClass =
  "text-text-secondary border border-black/15 bg-transparent px-2 py-0.5 text-[0.6875rem] font-bold tracking-wide uppercase dark:border-white/20 dark:text-neutral-400";

const TimelineItemDetails: React.FC<TimelineItemDetailsProps> = ({
  item,
  titleId,
  compact = false,
}) => {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <p
        className={`text-xs font-bold tracking-[0.2em] uppercase ${getTimelineTypeEyebrowClass(item.type)}`}
      >
        {getTypeLabel(item.type)}
      </p>
      <h3
        id={titleId}
        className={`text-text-primary dark:text-text-inverse mt-1.5 font-black tracking-tight uppercase ${
          compact
            ? "text-xl leading-tight sm:text-[1.35rem]"
            : "text-xl leading-tight sm:text-2xl sm:leading-tight"
        }`}
      >
        {item.title}
      </h3>
      <p className="text-primary-950 dark:text-primary-300 mt-1 text-sm font-bold">
        {item.company}
      </p>
      <p
        className={`text-text-secondary font-medium dark:text-neutral-300 ${
          compact ? "mt-2 line-clamp-4 text-sm leading-relaxed" : "mt-3 text-sm leading-relaxed"
        }`}
      >
        {item.description}
      </p>

      {item.technologies.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {item.technologies.map((tech) => (
            <li key={tech} className={techPillClass}>
              {tech}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default TimelineItemDetails;
