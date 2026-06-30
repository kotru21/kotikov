import React from "react";

import type { TimelineItem } from "@/entities/timeline";

import { getTimelineTypeEyebrowClass } from "./timelineTypeStyles";
import { getTypeLabel } from "./timelineUtils";

interface TimelineSlideContentProps {
  item: TimelineItem;
}

const techPillClass =
  "text-text-primary bg-background-primary border border-black px-2 py-1 text-xs font-bold dark:border-white dark:bg-neutral-900 dark:text-text-inverse";

const TimelineSlideContent: React.FC<TimelineSlideContentProps> = ({ item }) => {
  return (
    <div className="w-full px-2 md:pl-8 md:pr-0" aria-live="polite">
      <p
        className={`text-xs font-bold uppercase tracking-[0.22em] ${getTimelineTypeEyebrowClass(item.type)}`}
      >
        {getTypeLabel(item.type)}
      </p>
      <h3 className="text-text-primary mt-2 text-3xl font-black uppercase tracking-tight md:text-4xl dark:text-text-inverse">
        {item.title}
      </h3>
      <p className="text-primary-950 mt-1 text-sm font-bold dark:text-primary-300">
        {item.company}
      </p>
      <p className="text-text-secondary mt-4 text-sm font-medium leading-relaxed md:text-base dark:text-neutral-300">
        {item.description}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {item.technologies.map((tech) => (
          <li key={tech} className={techPillClass}>
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimelineSlideContent;
