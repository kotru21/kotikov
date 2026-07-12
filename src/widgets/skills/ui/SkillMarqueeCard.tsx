"use client";

import React, { useRef } from "react";

import type { SkillData } from "@/entities/skill";

import { useSkillsInteractionOptional } from "../model/SkillsInteractionContext";

interface SkillMarqueeCardProps {
  skill: SkillData;
}

const SkillMarqueeCard: React.FC<SkillMarqueeCardProps> = ({ skill }) => {
  const IconComponent = skill.icon;
  const cardRef = useRef<HTMLDivElement>(null);
  const interaction = useSkillsInteractionOptional();

  return (
    <div
      ref={cardRef}
      aria-hidden="true"
      tabIndex={-1}
      onMouseEnter={() => {
        interaction?.setActiveElement(cardRef.current);
      }}
      // Clear on leave so the cursor follows the pointer in gaps; next card enter re-targets.
      onMouseLeave={() => {
        interaction?.setActiveElement(null);
      }}
      className="flex min-w-fit items-center gap-4 border-2 border-black bg-white px-6 py-4 whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
    >
      {/* Логотип технологии */}
      <div className="shrink-0">
        <div
          className="flex h-12 w-12 items-center justify-center border-2 border-black dark:border-white"
          style={{ backgroundColor: skill.color }}
        >
          <IconComponent className="text-2xl text-white drop-shadow-md" />
        </div>
      </div>
      {/* Название и описание */}
      <div className="flex min-w-0 flex-col">
        <p className="text-lg font-bold tracking-wide text-black uppercase dark:text-white">
          {skill.name}
        </p>
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {skill.description}
        </p>
      </div>
    </div>
  );
};

export default SkillMarqueeCard;
