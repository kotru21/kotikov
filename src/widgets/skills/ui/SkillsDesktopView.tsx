"use client";

import React, { useRef } from "react";

import BauhausGridPattern from "@/shared/ui/BauhausGridPattern";

import { SkillsInteractionProvider } from "../model/SkillsInteractionContext";
import { SkillsCursorNyancat,SkillsMarquee } from "./index";

const SkillsDesktopView: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <SkillsInteractionProvider>
      <section
        ref={containerRef}
        id="skills"
        className="py-10 bg-[#f5f5f3] dark:bg-black relative overflow-hidden"
        style={{ }}>
        <SkillsCursorNyancat containerRef={containerRef} />
        <BauhausGridPattern opacity={0.1} size={40} />
        <div className="max-w-full mx-auto relative z-10">
          {/* Бегущая строка скиллов */}
          <SkillsMarquee />
        </div>
      </section>
    </SkillsInteractionProvider>
  );
};

export default SkillsDesktopView;
