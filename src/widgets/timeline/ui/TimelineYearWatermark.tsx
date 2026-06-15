"use client";

import React, { useState } from "react";

import { timelineDecadeCatSrc } from "./timelineDecadeCats";
import {
  extractYear,
  splitYearWithCatSlot,
  type TimelineDecadeKey,
} from "./timelineUtils";

interface TimelineYearWatermarkProps {
  period: string;
  slideClass: string;
}

const digitClass =
  "text-[7rem] font-black tracking-tighter text-black/5 select-none sm:text-[9rem] md:text-[12rem] lg:text-[14rem] dark:text-white/5";

const TimelineYearWatermark: React.FC<TimelineYearWatermarkProps> = ({ period, slideClass }) => {
  const year = extractYear(period);
  const parts = splitYearWithCatSlot(year);
  const [missingAssets, setMissingAssets] = useState<Partial<Record<TimelineDecadeKey, true>>>({});

  if (parts === null) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-12 left-1/2 z-0 -translate-x-1/2 sm:top-16 ${slideClass}`}
      >
        <span className={digitClass}>{year}</span>
      </div>
    );
  }

  const { prefix, suffix, decadeKey } = parts;
  const catSrc = timelineDecadeCatSrc[decadeKey];
  const showCat = missingAssets[decadeKey] !== true;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-12 left-1/2 z-0 -translate-x-1/2 sm:top-16 ${slideClass}`}
    >
      <div key={year} className={`flex items-center leading-none ${slideClass}`}>
        <span className={digitClass}>{prefix}</span>

        {showCat ? (
          <img
            src={catSrc}
            alt=""
            onError={() => {
              setMissingAssets((prev) => ({ ...prev, [decadeKey]: true }));
            }}
            className="mx-[-0.04em] h-[0.78em] w-auto max-w-[0.72em] shrink-0 self-center opacity-[0.22] sm:opacity-20 dark:opacity-[0.16]"
          />
        ) : (
          <span className={digitClass}>0</span>
        )}

        <span className={digitClass}>{suffix}</span>
      </div>
    </div>
  );
};

export default TimelineYearWatermark;
