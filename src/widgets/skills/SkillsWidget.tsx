"use client";

import React from "react";

import { useIsMobile } from "@/features/device";
import { useMobileSkillsScroll } from "@/features/skills-scroll";
import { skillsData } from "@/shared/config/content";

import { SkillsDesktopView, SkillsMobileView } from "./ui";

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
