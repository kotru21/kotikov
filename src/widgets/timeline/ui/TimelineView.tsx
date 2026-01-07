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

const TimelineView: React.FC<TimelineViewProps> = ({
  containerRef,
  sectionRef,
}) => {
  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="pb-8 px-4 sm:px-6 pt-16 lg:px-8 bg-background-primary dark:bg-background-tertiary transition-colors duration-300 relative z-10">
      <BauhausGridPattern className="text-black dark:text-white" opacity={0.03} />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="relative z-20 text-center px-4 mb-12">
          <h2
            className="mt-2 text-4xl md:text-5xl font-bold mb-3 drop-shadow-sm text-black dark:text-white uppercase tracking-tighter"
            style={{ }}>
            Мой опыт
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto text-neutral-600 dark:text-neutral-400 font-medium"
            style={{ }}>
            Путь профессионального развития и ключевые этапы карьеры
          </p>
        </div>

        {/* Горизонтальный таймлайн */}
        <div className="relative ">
          {/* Волнистая линия */}
          <TimelineWave />

          {/* Контейнер для скролла с градиентными масками */}
          <div className="relative">
            {/* Левая  */}
            <div
              className="absolute left-0 top-0 w-20 md:w-36 lg:w-48 h-full z-20 pointer-events-none bg-linear-to-r from-white via-white/60 to-transparent dark:from-neutral-950 dark:via-neutral-950/60 dark:to-transparent"
            />

            {/* Правая */}
            <div
              className="absolute right-0 top-0 w-20 md:w-36 lg:w-48 h-full z-20 pointer-events-none bg-linear-to-l from-white via-white/60 to-transparent dark:from-neutral-950 dark:via-neutral-950/60 dark:to-transparent"
            />

            {/* Контейнер для скролла */}
            <div
              ref={containerRef}
              className="overflow-x-auto  timeline-scroll-hidden"
              style={{
                overscrollBehaviorX: "contain",
                overscrollBehaviorY: "auto",
              }}>
              <div className="flex space-x-24 min-w-max px-28 items-center mb-24">
                {timelineData.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`relative transition-all duration-500 hover:scale-105 hover:z-30 group ${
                      index % 2 === 0 ? 'translate-y-4' : '-translate-y-4'
                    }`}
                  >
                    {/* Точка на линии */}
                    <div className="mb-4 flex justify-center opacity-50 group-hover:opacity-100 transition-opacity">
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
          <div className="flex justify-center ">
            <div
              className="flex items-center space-x-2 text-sm px-4 py-2 rounded-full"
              style={{
                backgroundColor: colors.background.gray,
                color: colors.text.muted,
              }}>
              <span>←</span>
              <span className="hidden sm:inline">
                Наведите курсор и прокрутите колёсиком мыши
              </span>
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

