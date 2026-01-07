"use client";

import React from "react";

import type { SkillData } from "@/entities/skill";

import { SkillMarqueeCard } from "./index";

interface SkillMarqueeRowProps {
  speed?: number;
  direction?: "left" | "right";
  skills: SkillData[];
}

const SkillMarqueeRow: React.FC<SkillMarqueeRowProps> = ({
  speed = 40,
  direction = "left",
  skills,
}) => {
  const animationDirection =
    direction === "left" ? "scroll-left" : "scroll-right";

  // достаточное количество копий для плавной анимации
  const totalCopies = 4;
  const skillsCopies = Array.from({ length: totalCopies }, (_, copyIndex) =>
    skills.map((skill, index) => ({
      ...skill,
      // Generate a unique ID based on copy index AND position in the original array
      // This handles cases where the input 'skills' array already has duplicates
      // 10000 limit allows for up to 10k skills in one row which is plenty
      uniqueKey: `${copyIndex}-${index}-${skill.id}`,
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
          <SkillMarqueeCard key={skill.uniqueKey} skill={skill} />
        ))}
      </div>
    </div>
  );
};

export default SkillMarqueeRow;
