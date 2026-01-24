"use client";

import React from "react";
import { FaLinkedinIn } from "react-icons/fa";

import { skillsData, social } from "@/shared/config/content";
import { Button } from "@/shared/ui";

import { SkillMarqueeRow } from ".";

const SkillsMarquee: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center space-y-10 overflow-visible py-8">
      {/* Заголовок */}
      <div className="relative z-20 mb-12 px-4 text-center">
        <h2
          className="mb-4 text-4xl font-bold tracking-tighter text-black uppercase drop-shadow-sm md:text-5xl dark:text-white"
          style={{}}
        >
          Мои Навыки
        </h2>
        <p
          className="mx-auto max-w-2xl text-lg font-medium text-neutral-600 dark:text-neutral-400"
          style={{}}
        >
          Технологии и инструменты, которыми я владею
        </p>
      </div>

      {/* Единственная строка со всеми скиллами */}
      <div className="w-full border-y-2 border-black bg-white py-6 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.1)] dark:border-white dark:bg-black">
        {/* Дублируем данные чтобы строка была длинной и насыщенной */}
        <SkillMarqueeRow skills={[...skillsData, ...skillsData]} speed={60} direction="left" />
      </div>

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
