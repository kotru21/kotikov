"use client";

import React, { useRef } from "react";

import { BauhausGridPattern } from "@/shared/ui";

import { SkillsInteractionProvider } from "../model/SkillsInteractionContext";
import { SkillsCursorNyancat,SkillsMarquee } from "./index";

const SkillsDesktopView: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <SkillsInteractionProvider>
      <section
        ref={containerRef}
        id="skills"
        className="py-10 bg-background-primary dark:bg-background-tertiary relative overflow-hidden transition-colors duration-300"
        style={{ }}>
        <SkillsCursorNyancat containerRef={containerRef} />
        <BauhausGridPattern className="text-black dark:text-white" opacity={0.03} />
        <div className="max-w-full mx-auto relative z-10">
          {/* Бегущая строка скиллов */}
          <SkillsMarquee />
        </div>
      </section>
    </SkillsInteractionProvider>
  );
};

export default SkillsDesktopView;

