"use client";

import React from "react";

import { skillsData } from "@/shared/config/content";

import { SkillMobileCardsContainer, SkillProgressIndicator } from ".";

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
      className="bg-background-primary dark:bg-background-tertiary relative transition-colors duration-300"
      style={{
        height: `${String(sectionHeight)}vh`,
      }}
    >
      {/* Header */}
      <div className="px-4 pt-20 pb-12 text-center">
        <h2 className="mb-6 text-4xl font-bold text-black md:text-5xl dark:text-white" style={{}}>
          Мои Навыки
        </h2>
        <p className="mx-auto max-w-3xl text-xl text-neutral-600 dark:text-neutral-400" style={{}}>
          Технологии и инструменты, которыми я владею для создания современных веб-приложений
        </p>
      </div>

      {/* Sticky контейнер с карточками */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="bg-background-primary dark:bg-background-tertiary h-full" style={{}}>
          <SkillMobileCardsContainer
            activeCardIndex={activeCardIndex}
            transitionProgress={transitionProgress}
            isTransitioning={isTransitioning}
            previousActiveIndex={previousActiveIndex}
          />
        </div>

        {/* Индикатор прогресса */}
        <SkillProgressIndicator activeIndex={activeCardIndex} totalItems={skillsData.length} />
      </div>
    </section>
  );
};

export default SkillsMobileView;
