import React from "react";

import type { SkillData } from "@/entities/skill";

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
  const getTransformStyle = (): {
    transform: string;
    opacity: number;
    zIndex: number;
    filter: string;
  } => {
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
        transform: `translateX(${String(translateX)}%) scale(${String(scale)}) rotateY(${String(rotateY)}deg)`,
        opacity,
        zIndex: 15,
        filter: `blur(${String(blur)}px) brightness(${String(0.95 + easeProgress * 0.05)})`,
      };
    }

    // direction === "exiting"
    // Плавная анимация выхода влево
    const easeProgress = Math.pow(transitionProgress, 2);
    const translateX = -easeProgress * 100; // Уходит влево
    const scale = 1 - easeProgress * 0.1; // Плавное уменьшение
    const rotateY = -easeProgress * 20; // Умеренный поворот
    const opacity = 1 - easeProgress;
    const blur = easeProgress * 3;

    return {
      transform: `translateX(${String(translateX)}%) scale(${String(scale)}) rotateY(${String(rotateY)}deg)`,
      opacity,
      zIndex: 5,
      filter: `blur(${String(blur)}px) brightness(${String(1 - easeProgress * 0.05)})`,
    };
  };

  const transformStyle = getTransformStyle();

  return (
    <div
      className="absolute inset-0 flex h-full w-full items-center justify-center px-8"
      style={{
        ...transformStyle,
        transition: direction === "current" ? "all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity, filter",
      }}
    >
      <div
        className="relative w-full max-w-sm border-2 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:bg-black dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
        style={{
          borderColor: skill.color,
        }}
      >
        <div className="text-center">
          <div
            className="mb-6 inline-flex h-16 w-16 items-center justify-center border-2 border-black text-2xl text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-500 dark:border-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            style={{
              backgroundColor: skill.color,
              transform: isActive ? "scale(1)" : "scale(0.9)",
            }}
          >
            <skill.icon className="h-8 w-8" />
          </div>
          <h3 className="mb-4 text-2xl font-bold text-black uppercase transition-all duration-500 dark:text-white">
            {skill.name}
          </h3>
          <p className="mb-8 leading-relaxed font-medium text-neutral-600 transition-all duration-500 dark:text-neutral-400">
            {skill.description}
          </p>

          {/* Прогресс бар */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold tracking-wider text-black uppercase dark:text-white">
                Уровень
              </span>
              <span className="text-sm font-bold text-black dark:text-white">
                {String(skill.level)}%
              </span>
            </div>
            <div className="h-4 w-full border-2 border-black p-0.5 dark:border-white">
              <div
                className="h-full transition-all duration-1000 ease-out"
                style={{
                  backgroundColor: skill.color,
                  width: isActive ? `${String(skill.level)}%` : "0%",
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
