"use client";

import React from "react";
import { type SkillData } from "@/entities/skill/model/types";
import { colors } from "@/styles/colors";

interface SkillMarqueeCardProps {
  skill: SkillData;
}

const SkillMarqueeCard: React.FC<SkillMarqueeCardProps> = ({ skill }) => {
  const IconComponent = skill.icon;

  return (
    <div
      className="flex items-center gap-4 px-6 py-4 rounded-lg shadow-sm border min-w-fit whitespace-nowrap"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.light,
      }}>
      {/* Логотип технологии */}
      <div className="flex-shrink-0">
        <div style={{ color: skill.color }}>
          <IconComponent className="text-3xl" />
        </div>
      </div>

      {/* Название и описание */}
      <div className="flex flex-col min-w-0">
        <h3
          className="text-lg font-semibold"
          style={{ color: colors.text.primary }}>
          {skill.name}
        </h3>
        <p
          className="text-sm opacity-75"
          style={{ color: colors.text.secondary }}>
          {skill.description}
        </p>
      </div>
    </div>
  );
};

export default SkillMarqueeCard;
