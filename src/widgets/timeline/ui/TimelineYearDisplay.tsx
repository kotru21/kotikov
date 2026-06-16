"use client";

import React, { useState } from "react";

import { timelineDecadeCatSrc } from "./timelineDecadeCats";
import {
  extractYear,
  splitYearWithCatSlot,
  type TimelineDecadeKey,
} from "./timelineUtils";

interface TimelineYearDisplayProps {
  period: string;
}

const digitClass =
  "text-[clamp(3.75rem,20vw,7.5rem)] font-black leading-none text-black/10 tabular-nums select-none dark:text-white/10";

const yearLayoutClass =
  "inline-grid w-[2.72em] grid-cols-4 items-center justify-items-center gap-x-[0.1em] leading-none";

const slotClass = "inline-flex h-[1em] w-full items-center justify-center";

const catImgClass =
  "h-[0.84em] w-[0.84em] object-contain object-center opacity-70 dark:opacity-60";

const TimelineYearDisplay: React.FC<TimelineYearDisplayProps> = ({ period }) => {
  const year = extractYear(period);
  const parts = splitYearWithCatSlot(year);
  const [missingAssets, setMissingAssets] = useState<Partial<Record<TimelineDecadeKey, true>>>({});

  if (parts === null) {
    return (
      <div className={`${yearLayoutClass} ${digitClass}`}>
        <span className="col-span-4 text-center">{year}</span>
      </div>
    );
  }

  const { decadeKey } = parts;
  const catSrc = timelineDecadeCatSrc[decadeKey];
  const showCat = missingAssets[decadeKey] !== true;

  return (
    <div className={`${yearLayoutClass} ${digitClass}`}>
      <span className={slotClass}>{year[0]}</span>

      <span className={slotClass}>
        {showCat ? (
          <img
            src={catSrc}
            alt=""
            onError={() => {
              setMissingAssets((prev) => ({ ...prev, [decadeKey]: true }));
            }}
            className={catImgClass}
          />
        ) : (
          <span className="leading-none">{year[1]}</span>
        )}
      </span>

      <span className={slotClass}>{year[2]}</span>
      <span className={slotClass}>{year[3]}</span>
    </div>
  );
};

export default TimelineYearDisplay;

