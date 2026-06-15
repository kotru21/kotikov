import React from "react";

import type { TimelineItem } from "@/entities/timeline";
import { timelineData } from "@/shared/config/content";

import TimelineSlideVisual from "./TimelineSlideVisual";
import { dotPositionPercent, extractYear } from "./timelineUtils";

interface TimelineRailProps {
  activeIndex: number;
  onSelect: (index: number) => void;
  motionClass: string;
  slideClass: string;
}

const TimelineRail: React.FC<TimelineRailProps> = ({
  activeIndex,
  onSelect,
  motionClass,
  slideClass,
}) => {
  const count = timelineData.length;
  const activeItem = timelineData[activeIndex] as TimelineItem;
  const activeLeft = dotPositionPercent(activeIndex, count);

  return (
    <>
      <div className="relative flex h-full flex-col items-center justify-start pt-2 sm:hidden">
        <div key={`mobile-meta-${String(activeIndex)}`} className={`flex flex-col items-center ${slideClass}`}>
          <span className="rounded-full border-2 border-black bg-black px-3 py-1 text-xs font-bold tracking-wide text-white uppercase dark:border-white dark:bg-white dark:text-black">
            {extractYear(activeItem.period)}
          </span>
          <div className="mt-5">
            <TimelineSlideVisual type={activeItem.type} index={activeIndex} />
          </div>
        </div>
        <div aria-hidden="true" className="mt-6 flex items-center gap-2">
          <span className="size-2 rounded-full bg-black dark:bg-white" />
          <span className="h-0.5 w-16 bg-black dark:bg-white" />
          <span className="size-2 rounded-full border-2 border-black dark:border-white" />
        </div>
      </div>

      <div className="relative mx-auto hidden h-full w-full max-w-4xl overflow-hidden px-8 sm:block md:px-12">
        <div
          className={`pointer-events-none absolute z-20 ${motionClass}`}
          style={{
            left: `${String(activeLeft)}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <TimelineSlideVisual type={activeItem.type} index={activeIndex} />
        </div>

        <div className="relative z-10 h-full">
          <div
            aria-hidden="true"
            className="absolute top-1/2 right-0 left-0 h-0.5 -translate-y-1/2 bg-black dark:bg-white"
          />

          <div className="absolute top-1/2 right-0 left-0 -translate-y-1/2">
            <div className="relative flex justify-between gap-1">
              {timelineData.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect(index);
                    }}
                    aria-label={`${item.title}, ${item.period}`}
                    aria-current={isActive ? "step" : undefined}
                    className="group relative flex min-w-0 flex-1 flex-col items-center"
                  >
                    <div className="mb-3 flex h-7 items-end justify-center">
                      {isActive ? (
                        <span className="max-w-full truncate rounded-full border-2 border-black bg-black px-2 py-1 text-[10px] font-bold tracking-wide text-white uppercase md:px-3 md:text-xs dark:border-white dark:bg-white dark:text-black">
                          {extractYear(item.period)}
                        </span>
                      ) : null}
                    </div>

                    <span
                      className={`relative flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-black bg-background-primary ${motionClass} dark:border-white dark:bg-background-tertiary ${
                        isActive ? "scale-100" : "scale-[0.58]"
                      }`}
                    >
                      {isActive ? (
                        <span
                          aria-hidden="true"
                          className="absolute -inset-2 rounded-full border-2 border-black dark:border-white"
                        />
                      ) : null}
                      <span className="size-2 rounded-full bg-black dark:bg-white" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimelineRail;
