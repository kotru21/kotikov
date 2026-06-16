"use client";

import React, { useCallback, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import type { TimelineItem } from "@/entities/timeline";
import { usePerformanceSettings } from "@/features/performance";
import { timelineData } from "@/shared/config/content";
import { BauhausGridPattern } from "@/shared/ui";

import TimelineSlideContent from "./TimelineSlideContent";
import { getSlideClass, timelineMotionClass } from "./timelineUtils";
import TimelineYearDisplay from "./TimelineYearDisplay";

const navButtonClass =
  "text-text-primary dark:text-text-inverse flex size-9 shrink-0 items-center justify-center border-2 border-black bg-white transition-opacity disabled:opacity-30 dark:border-white dark:bg-black";

const TimelineView: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const { reducedMotion } = usePerformanceSettings();
  const motionClass = reducedMotion ? "" : timelineMotionClass;

  const lastIndex = timelineData.length - 1;
  const activeItem = timelineData[activeIndex] as TimelineItem;
  const slideClass = getSlideClass(slideDirection, reducedMotion);

  const goTo = useCallback(
    (index: number): void => {
      setActiveIndex((current) => {
        const next = Math.max(0, Math.min(lastIndex, index));
        if (next !== current) {
          setSlideDirection(next > current ? 1 : -1);
        }
        return next;
      });
    },
    [lastIndex]
  );

  const goPrev = useCallback((): void => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const goNext = useCallback((): void => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  return (
    <section
      id="experience"
      className="bg-background-primary dark:bg-background-tertiary relative overflow-x-hidden px-4 py-10 transition-colors duration-300 sm:px-6 lg:px-8 lg:py-12"
    >
      <BauhausGridPattern className="text-black dark:text-white" opacity={0.03} />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-6 md:mb-8">
          <p className="text-primary-950 dark:text-primary-300 mb-2 text-sm font-bold tracking-[0.24em] uppercase">
            Опыт
          </p>
          <h2 className="text-text-primary dark:text-text-inverse text-3xl font-black tracking-tight uppercase md:text-4xl">
            Мой путь
          </h2>
          <p className="text-text-secondary mt-2 max-w-xl text-sm font-medium md:text-base dark:text-neutral-400">
            Образование, работа, хакатоны и личные проекты.
          </p>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-stretch md:justify-between md:gap-10 lg:gap-16">
          <div className="flex w-full shrink-0 flex-col justify-center gap-4 md:max-w-[26rem]">
            <div className="-mx-4 flex w-[calc(100%+2rem)] justify-center sm:-mx-6 sm:w-[calc(100%+3rem)] md:mx-0 md:w-full">
              <div
                className="relative h-[clamp(3.75rem,20vw,7.5rem)] w-full max-w-full"
                aria-hidden="true"
              >
                <div
                  key={activeItem.period}
                  className={`absolute inset-0 flex items-center justify-center ${slideClass}`}
                >
                  <TimelineYearDisplay period={activeItem.period} />
                </div>
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-[26rem] items-center gap-2 md:mx-0">
              <button
                type="button"
                onClick={goPrev}
                disabled={activeIndex === 0}
                aria-label="Предыдущий этап"
                className={navButtonClass}
              >
                <FiChevronLeft className="size-4" aria-hidden="true" />
              </button>

              <div
                className="flex min-w-0 flex-1 items-center justify-center gap-1"
                role="tablist"
                aria-label="Этапы опыта"
              >
                {timelineData.map((entry, index) => (
                  <button
                    key={entry.id}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    aria-label={`${entry.title}, ${entry.period}`}
                    onClick={() => {
                      goTo(index);
                    }}
                    className={`h-1 w-4 shrink-0 sm:w-5 ${motionClass} ${
                      index === activeIndex
                        ? "bg-black dark:bg-white"
                        : "bg-neutral-300 dark:bg-neutral-600"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                disabled={activeIndex === lastIndex}
                aria-label="Следующий этап"
                className={navButtonClass}
              >
                <FiChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center md:max-w-md md:shrink-0 lg:max-w-lg xl:mr-4">
            <div className="grid">
              {timelineData.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <div
                    key={item.id}
                    className={`col-start-1 row-start-1 ${
                      isActive
                        ? `z-10 opacity-100 ${slideClass}`
                        : "pointer-events-none opacity-0"
                    }`}
                    aria-hidden={!isActive}
                    {...(!isActive ? { inert: true } : {})}
                  >
                    <TimelineSlideContent item={item} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineView;
