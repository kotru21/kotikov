import React from "react";
import { SkillData } from "../../types";
import { colors } from "../../styles/colors";

interface SkillMobileCardProps {
  skill: SkillData;
}

const SkillMobileCard: React.FC<SkillMobileCardProps> = ({ skill }) => {
  return (
    <div
      className="w-full shadow-xl p-8 transition-all duration-700 ease-in-out transform rounded-lg"
      style={{
        backgroundColor: colors.background.tertiary,
        opacity: 1,
        transform: "scale(1)",
      }}>
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full text-white text-2xl mb-6 transition-all duration-500"
          style={{ backgroundColor: skill.color }}>
          <skill.icon className="w-8 h-8" />
        </div>
        <h3
          className="text-2xl font-bold mb-4 transition-all duration-500"
          style={{ color: colors.text.primary }}>
          {skill.name}
        </h3>
        <p
          className="mb-6 leading-relaxed transition-all duration-500"
          style={{ color: colors.text.secondary }}>
          {skill.description}
        </p>

        {/* Прогресс бар */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span
              className="text-sm font-medium"
              style={{ color: colors.text.tertiary }}>
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
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillMobileCard;
