"use client";

import React from "react";
import { FaLinkedinIn } from "react-icons/fa";

import { usePerformanceSettings } from "@/features/performance";
import { skillsData, skillsStackLine, social } from "@/shared/config/content";
import { formatExternalLinkLabel } from "@/shared/lib";
import { Button, SectionHeader } from "@/shared/ui";

import { SkillMarqueeRow, SkillsGroupedTags } from ".";

interface SkillsMarqueeProps {
  headingId: string;
  isMotionActive: boolean;
}

const SkillsMarquee: React.FC<SkillsMarqueeProps> = ({ headingId, isMotionActive }) => {
  const { reducedMotion, lowPerformance } = usePerformanceSettings();
  const showMarquee = !reducedMotion && !lowPerformance;

  return (
    <div className="flex w-full flex-col items-center gap-8 overflow-visible">
      <div className="relative z-20 w-full px-6 lg:px-8">
        <SectionHeader
          align="center"
          eyebrow="Навыки"
          title="Мои навыки"
          titleId={headingId}
          description="Технологии и инструменты, которыми я владею"
        />
        <p className="text-text-secondary mx-auto -mt-4 max-w-sm text-center text-base font-semibold dark:text-neutral-300">
          {skillsStackLine}
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
            isMotionActive={isMotionActive}
          />
        </div>
      ) : null}

      {/* Сгруппированные теги навыков — всегда видны */}
      <div className="w-full px-6 lg:px-8">
        <SkillsGroupedTags />
      </div>

      {/* Кнопка LinkedIn */}
      <div className="z-20 px-6 pt-2 lg:px-8">
        <Button
          href={social.linkedin.url}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="lg"
          aria-label={formatExternalLinkLabel("Мой профиль в LinkedIn")}
        >
          <FaLinkedinIn className="text-xl" aria-hidden="true" />
          <span>Мой профиль в LinkedIn</span>
        </Button>
      </div>
    </div>
  );
};

export default SkillsMarquee;
