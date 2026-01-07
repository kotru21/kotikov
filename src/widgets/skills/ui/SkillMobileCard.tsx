import React from "react";

import { type SkillData } from "@/entities/skill";

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
        className="w-full max-w-sm p-8 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] relative bg-white dark:bg-black"
        style={{
          borderColor: skill.color,
        }}>
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 text-white text-2xl mb-6 transition-all duration-500 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            style={{
              backgroundColor: skill.color,
              transform: isActive ? "scale(1)" : "scale(0.9)",
            }}>
            <skill.icon className="w-8 h-8" />
          </div>
          <h3
            className="text-2xl font-bold mb-4 uppercase transition-all duration-500 text-black dark:text-white">
            {skill.name}
          </h3>
          <p
            className="mb-8 leading-relaxed font-medium transition-all duration-500 text-neutral-600 dark:text-neutral-400">
            {skill.description}
          </p>

          {/* Прогресс бар */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span
                className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">
                Уровень
              </span>
              <span
                className="text-sm font-bold text-black dark:text-white">
                {skill.level}%
              </span>
            </div>
            <div className="w-full h-4 border-2 border-black dark:border-white p-0.5">
              <div
                className="h-full transition-all duration-1000 ease-out"
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
