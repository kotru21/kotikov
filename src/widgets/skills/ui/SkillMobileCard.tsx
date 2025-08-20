import React from "react";
import { type SkillData } from "@/entities/skill/model/types";
import { colors } from "@/styles/colors";

interface SkillMobileCardProps {
  skill: SkillData;
  isActive?: boolean;
  transitionProgress?: number;
  direction?: "entering" | "exiting" | "current";
}

const SkillMobileCard: React.FC<SkillMobileCardProps> = ({
  skill,
  isActive = true,
  transitionProgress = 0,
  direction = "current",
}) => {
  // трансформации для эффектов перелистывания
  const getTransformStyle = () => {
    if (direction === "current") {
      return {
        transform: "translateX(0) scale(1) rotateY(0deg)",
        opacity: 1,
        zIndex: 10,
        filter: "blur(0px) brightness(1)",
      };
    }

    if (direction === "entering") {
      // Плавная анимация входа справа
      const easeProgress = 1 - Math.pow(1 - transitionProgress, 2);
      const translateX = (1 - easeProgress) * 100; // Входит справа
      const scale = 0.9 + easeProgress * 0.1; // Плавное увеличение
      const rotateY = (1 - easeProgress) * 20; // Умеренный поворот
      const opacity = easeProgress;
      const blur = (1 - easeProgress) * 3;

      return {
        transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
        opacity,
        zIndex: 15,
        filter: `blur(${blur}px) brightness(${0.95 + easeProgress * 0.05})`,
      };
    }

    if (direction === "exiting") {
      // Плавная анимация выхода влево
      const easeProgress = Math.pow(transitionProgress, 2);
      const translateX = -easeProgress * 100; // Уходит влево
      const scale = 1 - easeProgress * 0.1; // Плавное уменьшение
      const rotateY = -easeProgress * 20; // Умеренный поворот
      const opacity = 1 - easeProgress;
      const blur = easeProgress * 3;

      return {
        transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
        opacity,
        zIndex: 5,
        filter: `blur(${blur}px) brightness(${1 - easeProgress * 0.05})`,
      };
    }

    return {
      transform: "translateX(100%) scale(0.85) rotateY(30deg)",
      opacity: 0,
      zIndex: 1,
      filter: "blur(4px) brightness(0.9)",
    };
  };

  const transformStyle = getTransformStyle();

  return (
    <div
      className="absolute inset-0 w-full h-full flex items-center justify-center px-8"
      style={{
        ...transformStyle,
        transition:
          direction === "current"
            ? "all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)"
            : "none",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity, filter",
      }}>
      <div
        className="w-full max-w-sm shadow-2xl p-8 rounded-xl border backdrop-blur-sm relative overflow-hidden"
        style={{
          backgroundColor: colors.background.tertiary,
          borderColor: skill.color,
          borderWidth: "2px",
          boxShadow: `0 25px 50px -12px ${skill.color}20, 0 0 0 1px ${skill.color}10`,
        }}>
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full text-white text-2xl mb-6 transition-all duration-500"
            style={{
              backgroundColor: skill.color,
              transform: isActive ? "scale(1)" : "scale(0.9)",
            }}>
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
                  width: isActive ? `${skill.level}%` : "0%",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillMobileCard;
