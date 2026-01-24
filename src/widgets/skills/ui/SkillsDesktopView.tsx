"use client";

import React, { useRef } from "react";

import { BauhausGridPattern } from "@/shared/ui";

import { SkillsInteractionProvider } from "../model/SkillsInteractionContext";
import { SkillsCursorNyancat, SkillsMarquee } from ".";

const SkillsDesktopView: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <SkillsInteractionProvider>
      <section
        ref={containerRef}
        id="skills"
        className="bg-background-primary dark:bg-background-tertiary relative overflow-hidden py-10 transition-colors duration-300"
        style={{}}
      >
        <SkillsCursorNyancat containerRef={containerRef} />
        <BauhausGridPattern className="text-black dark:text-white" opacity={0.03} />
        <div className="relative z-10 mx-auto max-w-full">
          {/* Бегущая строка скиллов */}
          <SkillsMarquee />
        </div>
      </section>
    </SkillsInteractionProvider>
  );
};

export default SkillsDesktopView;
