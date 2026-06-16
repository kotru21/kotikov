import React from "react";
import { FiExternalLink } from "react-icons/fi";

import type { TimelineItem } from "@/entities/timeline";

import { getTypeLabel } from "./timelineUtils";

interface TimelineSlideContentProps {
  item: TimelineItem;
}

const TimelineSlideContent: React.FC<TimelineSlideContentProps> = ({ item }) => {
  return (
    <div className="max-w-xl px-2 md:px-6" aria-live="polite">
      <p className="text-text-secondary text-xs font-bold tracking-[0.22em] uppercase">
        {getTypeLabel(item.type)} · {item.period}
      </p>
      <h3 className="text-text-primary dark:text-text-inverse mt-2 text-2xl font-black tracking-tight uppercase md:text-3xl">
        {item.title}
      </h3>
      <p className="text-primary-950 dark:text-primary-300 mt-1 text-sm font-bold">{item.company}</p>
      <p className="text-text-secondary mt-4 text-sm leading-relaxed font-medium md:text-base dark:text-neutral-300">
        {item.description}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {item.technologies.map((tech) => (
          <li
            key={tech}
            className="text-text-primary dark:text-text-inverse border border-black bg-white px-2 py-1 text-xs font-bold dark:border-white dark:bg-black"
          >
            {tech}
          </li>
        ))}
      </ul>

      {item.type === "project" && item.githubUrl !== undefined && item.githubUrl !== "" ? (
        <a
          href={item.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-primary dark:text-text-inverse mt-5 inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-xs font-bold uppercase transition-colors hover:bg-black hover:text-white dark:border-white dark:bg-black dark:hover:bg-white dark:hover:text-black"
        >
          <FiExternalLink aria-hidden="true" /> Подробнее
        </a>
      ) : null}
    </div>
  );
};

export default TimelineSlideContent;
