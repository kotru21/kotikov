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
  "inline-flex w-[2.72em] items-center justify-center gap-[0.1em] leading-none";

const digitSlotClass = "inline-flex w-[0.58em] shrink-0 items-center justify-center";

const zeroSlotClass =
  "inline-flex h-[0.78em] w-[0.68em] shrink-0 items-center justify-center";

const TimelineYearDisplay: React.FC<TimelineYearDisplayProps> = ({ period }) => {
  const year = extractYear(period);
  const parts = splitYearWithCatSlot(year);
  const [missingAssets, setMissingAssets] = useState<Partial<Record<TimelineDecadeKey, true>>>({});

  if (parts === null) {
    return (
      <div className={`${yearLayoutClass} ${digitClass}`}>
        <span className="text-center">{year}</span>
      </div>
    );
  }

  const { decadeKey } = parts;
  const catSrc = timelineDecadeCatSrc[decadeKey];
  const showCat = missingAssets[decadeKey] !== true;

  return (
    <div className={`${yearLayoutClass} ${digitClass}`}>
      <span className={digitSlotClass}>{year[0]}</span>

      <span className={zeroSlotClass}>
        {showCat ? (
          <img
            src={catSrc}
            alt=""
            onError={() => {
              setMissingAssets((prev) => ({ ...prev, [decadeKey]: true }));
            }}
            className="h-full w-full object-contain object-center opacity-70 dark:opacity-60"
          />
        ) : (
          <span className="leading-none">{year[1]}</span>
        )}
      </span>

      <span className={digitSlotClass}>{year[2]}</span>
      <span className={digitSlotClass}>{year[3]}</span>
    </div>
  );
};

export default TimelineYearDisplay;

