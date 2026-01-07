"use client";

import React from "react";
import { FaLinkedinIn } from "react-icons/fa";

import { skillsData, social } from "@/shared/config/content";
import { Button } from "@/shared/ui";

import { SkillMarqueeRow } from "./index";

const SkillsMarquee: React.FC = () => {
  return (
    <div className="w-full py-8 space-y-10 overflow-visible flex flex-col items-center">
       {/* Заголовок */}
      <div className="relative z-20 text-center px-4 mb-12">
        <h2
          className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-sm text-black dark:text-white uppercase tracking-tighter"
          style={{ }}>
          Мои Навыки
        </h2>
        <p
          className="text-lg max-w-2xl mx-auto text-neutral-600 dark:text-neutral-400 font-medium"
          style={{ }}>
          Технологии и инструменты, которыми я владею
        </p>
      </div>

      {/* Единственная строка со всеми скиллами */}
      <div className="w-full border-y-2 border-black dark:border-white py-6 bg-white dark:bg-black shadow-[0px_4px_0px_0px_rgba(0,0,0,0.1)]">
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

