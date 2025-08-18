"use client";

import React from "react";
import { skillsData } from "../data/skills";
import { useIsMobile } from "../hooks/useIsMobile";
import { useMobileSkillsScroll } from "../hooks/useMobileSkillsScroll";
import SkillsMobileView from "./Skills/SkillsMobileView";
import SkillsDesktopView from "./Skills/SkillsDesktopView";

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

  // Мобильная версия — презентер
  if (isMobile) {
    return (
      <SkillsMobileView
        activeCardIndex={activeCardIndex}
        transitionProgress={transitionProgress}
        isTransitioning={isTransitioning}
        previousActiveIndex={previousActiveIndex}
      />
    );
  }

  // Десктопная версия — презентер
  return <SkillsDesktopView />;
};

export default SkillsCards;
