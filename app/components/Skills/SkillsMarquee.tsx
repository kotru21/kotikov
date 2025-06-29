"use client";

import React from "react";
import { skillsData } from "../../data/skills";
import SkillMarqueeRow from "./SkillMarqueeRow";
import { colors } from "../../styles/colors";

const SkillsMarquee: React.FC = () => {
  // Разделим скиллы на группы для разных строк
  const firstRowSkills = skillsData.slice(0, 3);
  const secondRowSkills = skillsData.slice(3, 6);
  const thirdRowSkills = skillsData;

  return (
    <div className="w-full py-8 space-y-8">
      {/* Первая строка - медленная, влево */}
      <SkillMarqueeRow skills={firstRowSkills} speed={40} direction="left" />

      {/* Заголовок с градиентом */}
      <div className="relative py-16 overflow-hidden z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${colors.background.primary} 0%, transparent 100%)`,
          }}
        />

        {/* Контент заголовка */}
        <div className="relative z-20 text-center px-4">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg"
            style={{ color: colors.text.primary }}>
            Мои Навыки
          </h2>
          <p
            className="text-xl max-w-3xl mx-auto drop-shadow-sm"
            style={{ color: colors.text.secondary }}>
            Технологии и инструменты, которыми я владею для создания современных
            веб-приложений
          </p>
        </div>
      </div>

      <div className="relative -mt-28">
        <SkillMarqueeRow
          skills={secondRowSkills}
          speed={50}
          direction="right"
        />
      </div>

      <SkillMarqueeRow skills={thirdRowSkills} speed={40} direction="left" />
    </div>
  );
};

export default SkillsMarquee;
