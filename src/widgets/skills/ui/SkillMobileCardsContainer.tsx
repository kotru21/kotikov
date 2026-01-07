import React from "react";

import type { SkillData } from "@/entities/skill";
import { skillsData } from "@/shared/config/content";

import { SkillMobileCard } from "./index";

interface SkillMobileCardsContainerProps {
  activeCardIndex: number;
  transitionProgress: number;
  isTransitioning: boolean;
  previousActiveIndex: number;
}

const SkillMobileCardsContainer: React.FC<SkillMobileCardsContainerProps> = ({
  activeCardIndex,
  transitionProgress,
  isTransitioning,
  // previousActiveIndex - убрали из деструктуризации, так как не используется
}) => {
  // Определяем какие карточки показывать
  const getCurrentSkills = (): {
    skill: SkillData;
    direction: "entering" | "exiting" | "current";
    isActive: boolean;
    progress: number;
  }[] => {
    const skills: {
      skill: SkillData;
      direction: "entering" | "exiting" | "current";
      isActive: boolean;
      progress: number;
    }[] = [];

    if (!isTransitioning) {
      // Показываем только текущую карточку без переходов
      skills.push({
        skill: skillsData[activeCardIndex],
        direction: "current",
        isActive: true,
        progress: 0,
      });
    } else {
      // Во время перехода всегда показываем текущую (уходящую) и следующую (входящую)
      const nextIndex = activeCardIndex + 1;

      if (nextIndex < skillsData.length) {
        // Текущая карточка (уходящая влево)
        skills.push({
          skill: skillsData[activeCardIndex],
          direction: "exiting",
          isActive: false,
          progress: transitionProgress,
        });

        // Следующая карточка (входящая справа)
        skills.push({
          skill: skillsData[nextIndex],
          direction: "entering",
          isActive: true,
          progress: transitionProgress,
        });
      } else {
        // Последняя карточка - показываем только ее
        skills.push({
          skill: skillsData[activeCardIndex],
          direction: "current",
          isActive: true,
          progress: 0,
        });
      }
    }

    return skills;
  };

  const skillsToRender = getCurrentSkills();

  return (
    <div className="relative w-full h-full">
      {/* Карточки */}
      {skillsToRender.map(({ skill, direction, isActive, progress }, index) => (
        <SkillMobileCard
          key={`${String(skill.id)}-${direction}-${String(index)}`}
          skill={skill}
          isActive={isActive}
          transitionProgress={progress}
          direction={direction}
        />
      ))}
    </div>
  );
};

export default SkillMobileCardsContainer;
