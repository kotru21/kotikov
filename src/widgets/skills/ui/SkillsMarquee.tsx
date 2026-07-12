"use client";

import React from "react";
import { FaLinkedinIn } from "react-icons/fa";

import { skillsData, social } from "@/shared/config/content";
import { formatExternalLinkLabel } from "@/shared/lib";
import { Button } from "@/shared/ui";

import { SkillMarqueeRow, SkillsGroupedTags } from ".";
import { SkillsSectionIntro, useShowSkillsMarquee } from "./SkillsSectionIntro";

interface SkillsMarqueeProps {
  headingId: string;
  isMotionActive: boolean;
}

const SkillsMarquee: React.FC<SkillsMarqueeProps> = ({ headingId, isMotionActive }) => {
  const showMarquee = useShowSkillsMarquee();
  // CSS keyframes move -25% with 4 row copies ⇒ one base set per loop.
  // speed 30s with one base set ≈ prior 60s with a doubled base (same visual velocity).
  const marqueeSpeedSeconds = 30;

  return (
    <div className="flex w-full flex-col items-center gap-8 overflow-visible">
      <SkillsSectionIntro
        headingId={headingId}
        className="relative z-20 w-full px-6 md:px-8"
        stackClassName="text-text-secondary mx-auto -mt-4 max-w-sm text-center text-base font-semibold dark:text-neutral-300"
      />

      {showMarquee ? (
        <div data-skills-decorative-motion className="relative w-full overflow-x-clip">
          <SkillMarqueeRow
            curved
            arcHeight={64}
            skills={skillsData}
            speed={marqueeSpeedSeconds}
            direction="left"
            isMotionActive={isMotionActive}
          />
        </div>
      ) : null}

      <div className="w-full px-6 md:px-8">
        <SkillsGroupedTags />
      </div>

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
