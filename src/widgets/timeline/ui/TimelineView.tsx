"use client";

import React from "react";

import { TimelineCard } from "@/entities/timeline";
import { timelineData } from "@/shared/config/content";
import BauhausGridPattern from "@/shared/ui/BauhausGridPattern";
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
            {/* Левая градиентная маска */}
            <div
              className="absolute left-0 top-0 w-12 md:w-24 h-full z-20 pointer-events-none bg-linear-to-r from-background-primary via-background-primary/70 to-transparent dark:from-background-tertiary dark:via-background-tertiary/70"
            />

            {/* Правая градиентная маска */}
            <div
              className="absolute right-0 top-0 w-12 md:w-24 h-full z-20 pointer-events-none bg-linear-to-l from-background-primary via-background-primary/70 to-transparent dark:from-background-tertiary dark:via-background-tertiary/70"
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

      {/* Пиксельный переход в секцию контактов */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 bottom-0 w-full translate-y-full z-30"
      >
        <svg
          className="block w-full h-20 text-white dark:text-black"
          viewBox="0 0 1200 96"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
          style={{ transform: 'scaleY(-1)' }}
        >
          <defs>
            <pattern id="pixelWavePattern" x="0" y="0" width="40" height="8" patternUnits="userSpaceOnUse">
              <rect width="40" height="8" fill="currentColor" />
            </pattern>
          </defs>
          <path
            d="M 0 96 H 1200 V 52 H 1160 V 44 H 1120 V 36 H 1080 V 28 H 1040 V 36 H 1000 V 44 H 960 V 52 H 920 V 60 H 880 V 52 H 840 V 44 H 800 V 36 H 760 V 28 H 720 V 36 H 680 V 44 H 640 V 52 H 600 V 60 H 560 V 52 H 520 V 44 H 480 V 36 H 440 V 28 H 400 V 36 H 360 V 44 H 320 V 52 H 280 V 60 H 240 V 52 H 200 V 44 H 160 V 36 H 120 V 28 H 80 V 36 H 40 V 44 H 0 V 96 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
};

export default TimelineView;
