"use client";

import React from "react";
import { skillsData } from "../../data/skills";
import SkillMarqueeCard from "./SkillMarqueeCard";

interface SkillMarqueeRowProps {
  speed?: number;
  direction?: "left" | "right";
  skills: typeof skillsData;
}

const SkillMarqueeRow: React.FC<SkillMarqueeRowProps> = ({
  speed = 40,
  direction = "left",
  skills,
}) => {
  const animationDirection =
    direction === "left" ? "scroll-left" : "scroll-right";

  // Создаем достаточное количество копий для плавной анимации
  const totalCopies = 4;
  const skillsCopies = Array.from({ length: totalCopies }, (_, copyIndex) =>
    skills.map((skill) => ({
      ...skill,
      // Создаем уникальный числовой id для каждой копии
      id: copyIndex * 1000 + skill.id,
    }))
  ).flat();

  return (
    <div className="relative overflow-hidden py-2">
      <div
        className={`flex gap-6 animate-${animationDirection}`}
        style={{
          animationDuration: `${speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          width: "max-content",
        }}>
        {skillsCopies.map((skill) => (
          <SkillMarqueeCard key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  );
};

export default SkillMarqueeRow;
