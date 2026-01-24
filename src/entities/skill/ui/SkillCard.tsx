import React, { memo } from "react";

import { Card } from "@/shared/ui";
import { colors } from "@/styles/colors";

import type { SkillData } from "../model/types";

export interface SkillCardProps {
  skill: SkillData;
  index: number;
}

const SkillCardComponent: React.FC<SkillCardProps> = ({ skill, index }) => {
  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl"
      style={{
        backgroundColor: colors.background.tertiary,
        animationDelay: `${String(index * 0.1)}s`,
        animation: "fade-in-up 0.6s ease-out forwards",
        borderRadius: "0rem",
      }}
      hover={false}
    >
      <div className="text-center">
        <div
          className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full text-2xl text-black transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: skill.color }}
        >
          <skill.icon className="h-8 w-8" />
        </div>
        <h3 className="mb-4 text-2xl font-bold" style={{ color: colors.text.inverse }}>
          {skill.name}
        </h3>
        <p className="mb-6 leading-relaxed" style={{ color: colors.neutral[200] }}>
          {skill.description}
        </p>

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: colors.neutral[200] }}>
              Уровень
            </span>
            <span className="text-sm font-bold" style={{ color: colors.text.inverse }}>
              {String(skill.level)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full" style={{ backgroundColor: colors.neutral[200] }}>
            <div
              className="h-2 rounded-full transition-all duration-1000 ease-out"
              style={{
                backgroundColor: skill.color,
                width: `${String(skill.level)}%`,
                animationDelay: `${String(index * 0.2 + 0.5)}s`,
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

const SkillCard = memo(SkillCardComponent);
SkillCard.displayName = "SkillCard";

export default SkillCard;
