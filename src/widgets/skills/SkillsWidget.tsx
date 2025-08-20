"use client";

import React from "react";
import { skillsData } from "@/entities/skill/data";
import { useIsMobile } from "@/features/device/useIsMobile";
import { useMobileSkillsScroll } from "@/features/skills-scroll/useMobileSkillsScroll";
import { SkillsMobileView, SkillsDesktopView } from "./ui";

const SkillsWidget: React.FC = () => {
  const isMobile = useIsMobile();
  const {
    activeCardIndex,
    transitionProgress,
    isTransitioning,
    previousActiveIndex,
  } = useMobileSkillsScroll({ skillsCount: skillsData.length });

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

  return <SkillsDesktopView />;
};

export default SkillsWidget;
