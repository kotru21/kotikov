import React, { memo } from "react";
import { type SkillData } from "@/entities/skill/model/types";
import { colors } from "@/styles/colors";
import { Card } from "@/shared";

export interface SkillCardProps {
  skill: SkillData;
  index: number;
}

const SkillCardComponent: React.FC<SkillCardProps> = ({ skill, index }) => {
  return (
    <Card
      className=" group hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
      style={{
        backgroundColor: colors.background.tertiary,
        animationDelay: `${index * 0.1}s`,
        animation: "fade-in-up 0.6s ease-out forwards",
        borderRadius: "0rem",
      }}
      hover={false}>
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: skill.color }}>
          <skill.icon className="w-8 h-8" />
        </div>
        <h3
          className="text-2xl font-bold mb-4"
          style={{ color: colors.text.primary }}>
          {skill.name}
        </h3>
        <p
          className="mb-6 leading-relaxed"
          style={{ color: colors.neutral[600] }}>
          {skill.description}
        </p>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span
              className="text-sm font-medium"
              style={{ color: colors.neutral[700] }}>
              Уровень
            </span>
            <span
              className="text-sm font-bold"
              style={{ color: colors.text.inverse }}>
              {skill.level}%
            </span>
          </div>
          <div
            className="w-full rounded-full h-2"
            style={{ backgroundColor: colors.neutral[200] }}>
            <div
              className="h-2 rounded-full transition-all duration-1000 ease-out"
              style={{
                backgroundColor: skill.color,
                width: `${skill.level}%`,
                animationDelay: `${index * 0.2 + 0.5}s`,
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
