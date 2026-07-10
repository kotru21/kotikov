"use client";

import React, { useRef } from "react";

import { useSceneMotionPolicy } from "@/features/performance";
import { BauhausGridPattern } from "@/shared/ui";

import { SkillsInteractionProvider } from "../model/SkillsInteractionContext";
import { SkillsCursorNyancat, SkillsMarquee } from ".";

interface SkillsDesktopViewProps {
  headingId: string;
}

const SkillsDesktopView: React.FC<SkillsDesktopViewProps> = ({ headingId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const motion = useSceneMotionPolicy(containerRef, { dominantEffect: "marquee" });

  return (
    <SkillsInteractionProvider>
      <div
        ref={containerRef}
        role="group"
        aria-labelledby={headingId}
        className="relative -my-[var(--section-space-dense)] py-[var(--section-space-dense)]"
      >
        <SkillsCursorNyancat containerRef={containerRef} isMotionActive={motion.canRunContinuous} />
        <BauhausGridPattern className="text-black dark:text-white" opacity={0.03} />
        <SkillsMarquee headingId={headingId} isMotionActive={motion.canRunContinuous} />
      </div>
    </SkillsInteractionProvider>
  );
};

export default SkillsDesktopView;
