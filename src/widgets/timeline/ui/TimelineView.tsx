"use client";

import React from "react";
import { colors } from "@/styles/colors";
import { timelineData } from "@/entities/timeline/data";
import TimelineCard from "@/entities/timeline/ui/TimelineCard";
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
      className="pb-8 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: colors.background.primary }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl font-bold mb-4"
            style={{ color: colors.text.primary }}>
            Мой опыт
          </h2>
          <p
            className="text-xl max-w-2xl mx-auto"
            style={{ color: colors.text.secondary }}>
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
              className="absolute left-0 top-0 w-12 md:w-24 h-full z-20 pointer-events-none"
              style={{
                background: `linear-gradient(to right, ${colors.background.primary}, ${colors.background.primary}B3, transparent)`,
              }}
            />

            {/* Правая градиентная маска */}
            <div
              className="absolute right-0 top-0 w-12 md:w-24 h-full z-20 pointer-events-none"
              style={{
                background: `linear-gradient(to left, ${colors.background.primary}, ${colors.background.primary}B3, transparent)`,
              }}
            />

            {/* Контейнер для скролла */}
            <div
              ref={containerRef}
              className="overflow-x-auto  timeline-scroll-hidden pt-4"
              style={{
                overscrollBehaviorX: "contain",
                overscrollBehaviorY: "auto",
              }}>
              <div className="flex space-x-8 min-w-max px-28">
                {timelineData.map((item, index) => (
                  <div key={item.id} className="relative">
                    {/* Точка на линии */}
                    <TimelinePoint type={item.type} index={index} />

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
