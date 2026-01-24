"use client";

import React from "react";

import { TimelineCard } from "@/entities/timeline";
import { timelineData } from "@/shared/config/content";
import { BauhausGridPattern } from "@/shared/ui";
import { colors } from "@/styles/colors";

import TimelinePoint from "./TimelinePoint";
import TimelineWave from "./TimelineWave";

interface TimelineViewProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  sectionRef: React.RefObject<HTMLElement | null>;
}

const TimelineView: React.FC<TimelineViewProps> = ({ containerRef, sectionRef }) => {
  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="bg-background-primary dark:bg-background-tertiary relative z-10 px-4 pt-16 pb-8 transition-colors duration-300 sm:px-6 lg:px-8"
    >
      <BauhausGridPattern className="text-black dark:text-white" opacity={0.03} />
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="relative z-20 mb-12 px-4 text-center">
          <h2
            className="mt-2 mb-3 text-4xl font-bold tracking-tighter text-black uppercase drop-shadow-sm md:text-5xl dark:text-white"
            style={{}}
          >
            Мой опыт
          </h2>
          <p
            className="mx-auto max-w-2xl text-lg font-medium text-neutral-600 dark:text-neutral-400"
            style={{}}
          >
            Путь профессионального развития и ключевые этапы карьеры
          </p>
        </div>

        {/* Горизонтальный таймлайн */}
        <div className="relative">
          {/* Волнистая линия */}
          <TimelineWave />

          {/* Контейнер для скролла с градиентными масками */}
          <div className="relative">
            {/* Левая  */}
            <div className="pointer-events-none absolute top-0 left-0 z-20 h-full w-20 bg-linear-to-r from-white via-white/60 to-transparent md:w-36 lg:w-48 dark:from-neutral-950 dark:via-neutral-950/60 dark:to-transparent" />

            {/* Правая */}
            <div className="pointer-events-none absolute top-0 right-0 z-20 h-full w-20 bg-linear-to-l from-white via-white/60 to-transparent md:w-36 lg:w-48 dark:from-neutral-950 dark:via-neutral-950/60 dark:to-transparent" />

            {/* Контейнер для скролла */}
            <div
              ref={containerRef}
              className="timeline-scroll-hidden overflow-x-auto"
              style={{
                overscrollBehaviorX: "contain",
                overscrollBehaviorY: "auto",
              }}
            >
              <div className="mb-24 flex min-w-max items-center space-x-24 px-28">
                {timelineData.map((item, index) => (
                  <div
                    key={item.id}
                    className={`group relative transition-all duration-500 hover:z-30 hover:scale-105 ${
                      index % 2 === 0 ? "translate-y-4" : "-translate-y-4"
                    }`}
                  >
                    {/* Точка на линии */}
                    <div className="mb-4 flex justify-center opacity-50 transition-opacity group-hover:opacity-100">
                      <TimelinePoint type={item.type} index={index} />
                    </div>

                    {/* Карточка опыта */}
                    <TimelineCard item={item} index={index} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Индикатор прокрутки */}
          <div className="flex justify-center">
            <div
              className="flex items-center space-x-2 rounded-full px-4 py-2 text-sm"
              style={{
                backgroundColor: colors.background.gray,
                color: colors.text.muted,
              }}
            >
              <span>←</span>
              <span className="hidden sm:inline">Наведите курсор и прокрутите колёсиком мыши</span>
              <span className="sm:hidden">Проведите пальцем для прокрутки</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineView;
