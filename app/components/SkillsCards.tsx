"use client";

import React from "react";
import { colors } from "../styles/colors";
import { skillsData } from "../data/skills";
import { useIsMobile } from "../hooks/useIsMobile";
import { useMobileSkillsScroll } from "../hooks/useMobileSkillsScroll";
import { SkillCard, SkillProgressIndicator } from "./Skills";
import SkillMobileCardsContainer from "./Skills/SkillMobileCardsContainer";

const SkillsCards: React.FC = () => {
  const isMobile = useIsMobile();
  const {
    activeCardIndex,
    transitionProgress,
    isTransitioning,
    previousActiveIndex,
  } = useMobileSkillsScroll({
    skillsCount: skillsData.length,
  });

  // Мобильная версия
  if (isMobile) {
    //100vh для заголовка + по 100vh для каждой карточки
    const sectionHeight = 100 + skillsData.length * 100;

    return (
      <section
        id="skills"
        className="relative"
        style={{
          height: `${sectionHeight}vh`,
          backgroundColor: colors.background.primary,
        }}>
        {/* Header */}
        <div className="text-center pt-20 pb-16 px-4">
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
  }

  // Десктопная версия
  return (
    <section
      id="skills"
      className="py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: colors.background.primary }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
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

        {/* Сетка навыков */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {skillsData.map((skill, index) => (
            <div
              key={skill.id}
              className="border-r border-b border-gray-200 last:border-r-0 md:last:border-r-0 lg:last:border-r-0 lg:[&:nth-child(3n)]:border-r-0 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(n+4)]:border-b-0 md:[&:nth-child(n+5)]:border-b-0 [&:nth-child(n+7)]:border-b-0"
              style={{ borderColor: colors.border.dark }}>
              <SkillCard skill={skill} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsCards;
