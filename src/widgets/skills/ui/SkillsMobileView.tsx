"use client";

import React from "react";

import { skillsData } from "@/shared/config/content";

import { SkillMobileCardsContainer,SkillProgressIndicator } from "./index";

interface SkillsMobileViewProps {
  activeCardIndex: number;
  transitionProgress: number;
  isTransitioning: boolean;
  previousActiveIndex: number;
}

const SkillsMobileView: React.FC<SkillsMobileViewProps> = ({
  activeCardIndex,
  transitionProgress,
  isTransitioning,
  previousActiveIndex,
}) => {
  const sectionHeight = 100 + skillsData.length * 100; // 100vh header + 100vh per card

  return (
    <section
      id="skills"
      className="relative bg-background-primary dark:bg-background-tertiary transition-colors duration-300"
      style={{
        height: `${sectionHeight}vh`,
      }}>
      {/* Header */}
      <div className="text-center pt-20 pb-12 px-4">
        <h2
          className="text-4xl md:text-5xl font-bold mb-6 text-black dark:text-[#f5f5f3]"
          style={{ }}>
          Мои Навыки
        </h2>
        <p
          className="text-xl max-w-3xl mx-auto text-neutral-600 dark:text-neutral-400"
          style={{ }}>
          Технологии и инструменты, которыми я владею для создания современных
          веб-приложений
        </p>
      </div>

      {/* Sticky контейнер с карточками */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="h-full bg-background-primary dark:bg-background-tertiary"
          style={{ }}>
          <SkillMobileCardsContainer
            activeCardIndex={activeCardIndex}
            transitionProgress={transitionProgress}
            isTransitioning={isTransitioning}
            previousActiveIndex={previousActiveIndex}
          />
        </div>

        {/* Индикатор прогресса */}
        <SkillProgressIndicator
          activeIndex={activeCardIndex}
          totalItems={skillsData.length}
        />
      </div>
    </section>
  );
};

export default SkillsMobileView;
