"use client";

import React from "react";
import { colors } from "../../styles/colors";
import { skillsData } from "../../data/skills";
import { SkillProgressIndicator } from "./index";
import SkillMobileCardsContainer from "./SkillMobileCardsContainer";

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
      className="relative"
      style={{
        height: `${sectionHeight}vh`,
        backgroundColor: colors.background.primary,
      }}>
      {/* Header */}
      <div className="text-center pt-20 pb-16 px-4 ">
        <h2
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{ color: colors.text.primary }}>
          Мои Навыки
        </h2>
        <p
          className="text-xl max-w-3xl mx-auto"
          style={{ color: colors.text.secondary }}>
          Технологии и инструменты, которыми я владею для создания современных
          веб-приложений
        </p>
      </div>

      {/* Sticky контейнер с карточками */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="h-full"
          style={{ background: colors.background.primary }}>
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
