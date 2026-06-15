"use client";

import React from "react";
import { FaLinkedinIn } from "react-icons/fa";

import { usePerformanceSettings } from "@/features/performance";
import { skillsData, social } from "@/shared/config/content";
import { Button } from "@/shared/ui";

import { SkillMarqueeRow, SkillsGroupedTags } from ".";

const SkillsMarquee: React.FC = () => {
  const { reducedMotion, lowPerformance } = usePerformanceSettings();
  const showMarquee = !reducedMotion && !lowPerformance;

  return (
    <div className="flex w-full flex-col items-center space-y-10 overflow-visible py-8">
      {/* Заголовок */}
      <div className="relative z-20 mb-12 px-4 text-center">
        <h2
          className="mb-4 text-4xl font-bold tracking-tighter text-black uppercase drop-shadow-sm md:text-5xl dark:text-white"
          style={{}}
        >
          Мои навыки
          <span className="mt-3 block text-base font-semibold tracking-normal text-neutral-700 normal-case dark:text-neutral-300">
            React, JavaScript, Node.js, фреймворк Next.js
          </span>
        </h2>
        <p
          className="mx-auto max-w-2xl text-lg font-medium text-neutral-600 dark:text-neutral-400"
          style={{}}
        >
          Технологии и инструменты, которыми я владею
        </p>
      </div>

      {/* Единственная строка со всеми скиллами — только при включённой анимации */}
      {showMarquee ? (
        <div className="relative w-full overflow-x-clip">
          <SkillMarqueeRow
            curved
            arcHeight={64}
            skills={[...skillsData, ...skillsData]}
            speed={60}
            direction="left"
          />
        </div>
      ) : null}

      {/* Сгруппированные теги навыков — всегда видны */}
      <SkillsGroupedTags />

      {/* Кнопка LinkedIn */}
      <div className="z-20 pt-2">
        <Button
          href={social.linkedin.url}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="lg"
        >
          <FaLinkedinIn className="text-xl" />
          <span>Мой профиль в LinkedIn</span>
        </Button>
      </div>
    </div>
  );
};

export default SkillsMarquee;
