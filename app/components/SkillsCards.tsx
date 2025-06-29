"use client";

import React from "react";
import { colors } from "../styles/colors";
import { skillsData } from "../data/skills";
import { useIsMobile } from "../hooks/useIsMobile";
import { useMobileSkillsScroll } from "../hooks/useMobileSkillsScroll";
import { SkillProgressIndicator, SkillsMarquee } from "./Skills";
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
  }

  // Десктопная версия
  return (
    <section
      id="skills"
      className="py-20"
      style={{ backgroundColor: colors.background.primary }}>
      <div className="max-w-full mx-auto">
        {/* Бегущая строка скиллов */}
        <SkillsMarquee />
      </div>
    </section>
  );
};

export default SkillsCards;
