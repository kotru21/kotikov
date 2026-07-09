"use client";

import React, { useRef } from "react";

import { BauhausGridPattern } from "@/shared/ui";

import { SkillsInteractionProvider } from "../model/SkillsInteractionContext";
import { SkillsCursorNyancat, SkillsMarquee } from ".";

interface SkillsDesktopViewProps {
  headingId: string;
}

const SkillsDesktopView: React.FC<SkillsDesktopViewProps> = ({ headingId }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <SkillsInteractionProvider>
      <div ref={containerRef} role="group" aria-labelledby={headingId} className="relative">
        <SkillsCursorNyancat containerRef={containerRef} />
        <BauhausGridPattern className="text-black dark:text-white" opacity={0.03} />
        <SkillsMarquee headingId={headingId} />
      </div>
    </SkillsInteractionProvider>
  );
};

export default SkillsDesktopView;
