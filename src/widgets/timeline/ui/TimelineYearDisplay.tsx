"use client";

import Image from "next/image";
import React, { useState } from "react";

import { timelineDecadeCatSrc } from "./timelineDecadeCats";
import { extractYear, splitYearWithCatSlot, type TimelineDecadeKey } from "./timelineUtils";

interface TimelineYearDisplayProps {
  period: string;
  layout?: "standalone" | "sidebar" | "row";
}

const rowDigitClass =
  "text-2xl font-black leading-none text-text-primary tabular-nums select-none sm:text-3xl dark:text-text-inverse";

const sidebarDigitClass =
  "text-4xl font-black leading-none text-text-primary tabular-nums select-none dark:text-text-inverse";

const standaloneDigitClass =
  "text-5xl font-black leading-none text-text-primary tabular-nums select-none xl:text-[3.5rem] dark:text-text-inverse";

const layoutClass =
  "grid w-full grid-cols-4 items-center justify-items-center gap-x-0.5 leading-none";

const slotClass = "inline-flex h-[1em] w-full items-center justify-center";

const catImgClass = "h-[0.84em] w-[0.84em] object-contain object-center";

function hasDetailedPeriod(period: string, year: string): boolean {
  const remainder = period.replace(year, "").replace(/[—–-]/g, "").replace(/н\.в\.?/gi, "").trim();
  return remainder.length > 0;
}

const TimelineYearDisplay: React.FC<TimelineYearDisplayProps> = ({
  period,
  layout = "standalone",
}) => {
  const year = extractYear(period);
  const parts = splitYearWithCatSlot(year);
  const [missingAssets, setMissingAssets] = useState<Partial<Record<TimelineDecadeKey, true>>>({});
  let digitClass = standaloneDigitClass;
  if (layout === "row") digitClass = rowDigitClass;
  else if (layout === "sidebar") digitClass = sidebarDigitClass;

  const isStandalone = layout === "standalone";

  const yearGrid =
    parts === null ? (
      <div className={`${layoutClass} ${digitClass}`}>
        <span className="col-span-4 text-center">{year}</span>
      </div>
    ) : (
      (() => {
        const { decadeKey } = parts;
        const catSrc = timelineDecadeCatSrc[decadeKey];
        const showCat = missingAssets[decadeKey] !== true;

        return (
          <div className={`${layoutClass} ${digitClass}`}>
            <span className={slotClass}>{year[0]}</span>

            <span className={slotClass}>
              {showCat ? (
                <Image
                  src={catSrc}
                  alt=""
                  width={24}
                  height={24}
                  unoptimized
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
      })()
    );

  return (
    <div
      className={`flex w-full flex-col items-start gap-1.5 ${
        isStandalone ? "border-b-2 border-black/10 pb-5 dark:border-white/15" : ""
      }`}
    >
      {yearGrid}
      {hasDetailedPeriod(period, year) ? (
        <p className="text-text-secondary mt-0.5 w-full text-[0.625rem] font-bold tracking-[0.1em] uppercase dark:text-neutral-400">
          {period}
        </p>
      ) : null}
    </div>
  );
};

export default TimelineYearDisplay;
