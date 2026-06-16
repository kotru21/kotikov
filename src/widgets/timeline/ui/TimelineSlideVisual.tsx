import React from "react";

import type { TimelineItem } from "@/entities/timeline";

const accentByIndex = ["bg-primary-500", "bg-primary-300", "bg-primary-700"];

interface TimelineSlideVisualProps {
  type: TimelineItem["type"];
  index: number;
}

const TimelineSlideVisual: React.FC<TimelineSlideVisualProps> = ({ type, index }) => {
  const accent = accentByIndex[index % accentByIndex.length];

  return (
    <div
      className={`relative size-40 overflow-hidden rounded-full border-4 border-black sm:size-52 md:size-64 lg:size-72 dark:border-white ${accent}`}
    >
      <div className="absolute -top-4 -right-4 size-16 rounded-full bg-primary-300 opacity-90 sm:size-20" />
      <div className="absolute bottom-5 left-5 h-3 w-16 bg-black/90 dark:bg-white/90" />

      {type === "education" ? (
        <div className="absolute right-6 bottom-6 size-0 border-x-[18px] border-b-[28px] border-x-transparent border-b-[#00b583]" />
      ) : null}

      {type === "hackathon" ? (
        <div className="absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-black bg-white dark:border-white dark:bg-black" />
      ) : null}

      {type === "work" ? (
        <div className="absolute top-6 left-6 h-10 w-10 border-2 border-black bg-white dark:border-white dark:bg-black" />
      ) : null}

      {type === "project" ? (
        <div className="absolute right-8 top-8 h-8 w-14 border-2 border-black bg-white dark:border-white dark:bg-black" />
      ) : null}
    </div>
  );
};

export default TimelineSlideVisual;
