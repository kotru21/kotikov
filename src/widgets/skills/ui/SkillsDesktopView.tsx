"use client";

import React, { useRef } from "react";

import { BauhausGridPattern, Section } from "@/shared/ui";

import { SkillsInteractionProvider } from "../model/SkillsInteractionContext";
import { SkillsCursorNyancat, SkillsMarquee } from ".";

const SkillsDesktopView: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <SkillsInteractionProvider>
      <Section
        ref={containerRef}
        id="skills"
        spacing="compact"
        backgroundClassName="bg-background-primary dark:bg-background-tertiary"
        className="overflow-x-clip"
        innerClassName="relative z-10 max-w-full"
      >
        <SkillsCursorNyancat containerRef={containerRef} />
        <BauhausGridPattern className="text-black dark:text-white" opacity={0.03} />
        <SkillsMarquee />
      </Section>
    </SkillsInteractionProvider>
  );
};

export default SkillsDesktopView;
