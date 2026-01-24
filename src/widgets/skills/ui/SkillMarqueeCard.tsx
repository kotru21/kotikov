"use client";

import React, { useRef } from "react";

import type { SkillData } from "@/entities/skill";

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
      role="button"
      tabIndex={0}
      onMouseEnter={() => {
        setActiveElement(cardRef.current);
      }}
      // Мы не зануляем элемент при выходе, чтобы кот "помнил" последнюю карту, пока мы не перейдем на другую или не уйдем в пустоту
      onMouseLeave={() => {
        setActiveElement(null);
      }}
      onFocus={() => {
        setActiveElement(cardRef.current);
      }}
      onBlur={() => {
        setActiveElement(null);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setActiveElement(cardRef.current);
        }
      }}
      className="flex min-w-fit items-center gap-4 border-2 border-black bg-white px-6 py-4 whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
    >
      {" "}
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
        <h3 className="text-lg font-bold tracking-wide text-black uppercase dark:text-white">
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
