"use client";

import React, { useRef } from "react";

import { type SkillData } from "@/entities/skill";

import { useSkillsInteraction } from "../model/SkillsInteractionContext";

interface SkillMarqueeCardProps {
  skill: SkillData;
}

const SkillMarqueeCard: React.FC<SkillMarqueeCardProps> = ({ skill }) => {
  const IconComponent = skill.icon;
  const cardRef = useRef<HTMLDivElement>(null);
  const { setActiveElement } = useSkillsInteraction();

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setActiveElement(cardRef.current)}
      // Мы не зануляем элемент при выходе, чтобы кот "помнил" последнюю карту, пока мы не перейдем на другую или не уйдем в пустоту
      onMouseLeave={() => setActiveElement(null)}
      className="flex items-center gap-4 px-6 py-4 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] min-w-fit whitespace-nowrap bg-white dark:bg-black transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
      {/* Логотип технологии */}
      <div className="shrink-0">
        <div
          className="w-12 h-12 flex items-center justify-center border-2 border-black dark:border-white"
          style={{ backgroundColor: skill.color }}>
          <IconComponent className="text-2xl text-white drop-shadow-md" />
        </div>
      </div>

      {/* Название и описание */}
      <div className="flex flex-col min-w-0">
        <h3 className="text-lg font-bold uppercase tracking-wide text-black dark:text-white">
          {skill.name}
        </h3>
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {skill.description}
        </p>
      </div>
    </div>
  );
};

export default SkillMarqueeCard;
