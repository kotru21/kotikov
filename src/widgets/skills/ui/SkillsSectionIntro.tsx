"use client";

import React from "react";

import { usePerformanceSettings } from "@/features/performance";
import { skillsStackLine } from "@/shared/config/content";
import { SectionHeader } from "@/shared/ui";

interface SkillsSectionIntroProps {
  headingId: string;
  className?: string;
  stackClassName?: string;
}

/** Shared skills heading + stack line (CTA/marquee order stay view-specific). */
export function SkillsSectionIntro({
  headingId,
  className,
  stackClassName,
}: SkillsSectionIntroProps): React.JSX.Element {
  return (
    <div className={className}>
      <SectionHeader
        align="center"
        eyebrow="Навыки"
        title="Мои навыки"
        titleId={headingId}
        description="Технологии и инструменты, которыми я владею"
      />
      <p className={stackClassName}>{skillsStackLine}</p>
    </div>
  );
}

/** True when skills marquees / cursor decoration are allowed to mount. */
export function useShowSkillsMarquee(): boolean {
  const { reducedMotion, lowPerformance } = usePerformanceSettings();
  return !reducedMotion && !lowPerformance;
}
