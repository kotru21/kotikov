"use client";

import dynamic from "next/dynamic";
import { type ReactNode, type RefObject, useRef } from "react";

import { usePerformanceSettings, useSceneMotionPolicy } from "@/features/performance/client";
import { skillsData } from "@/shared/config/content";
import { MarqueeTicker } from "@/shared/ui/MarqueeTicker";

import { SkillsInteractionProvider } from "../model/SkillsInteractionContext";
import SkillsGroupedTags from "./SkillsGroupedTags";

const SkillsCursorNyancat = dynamic(() => import("./SkillsCursorNyancat"));

const SKILLS_TICKER = skillsData.map((skill) => skill.name).join(" × ");
const TICKER_CLASS = "border-0 px-6 py-3 font-bold tracking-wide uppercase";

interface SkillsNyancatProps {
  containerRef: RefObject<HTMLDivElement | null>;
  isMotionActive: boolean;
}

function useShowSkillsNyancat(): boolean {
  const { reducedMotion, lowPerformance } = usePerformanceSettings();
  return !reducedMotion && !lowPerformance;
}

function SkillsNyancat({
  containerRef,
  isMotionActive,
}: SkillsNyancatProps): React.JSX.Element | null {
  const showNyancat = useShowSkillsNyancat();
  if (!showNyancat) {
    return null;
  }

  return <SkillsCursorNyancat containerRef={containerRef} isMotionActive={isMotionActive} />;
}

interface SkillsViewsProps {
  heading: ReactNode;
}

export default function SkillsViews({ heading }: SkillsViewsProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const motion = useSceneMotionPolicy(containerRef, { dominantEffect: "marquee" });

  return (
    <SkillsInteractionProvider>
      <div ref={containerRef} className="relative overflow-hidden">
        <SkillsNyancat containerRef={containerRef} isMotionActive={motion.canRunContinuous} />
        {heading}
        <div data-nyancat-perch>
          <MarqueeTicker text={SKILLS_TICKER} className={TICKER_CLASS} />
        </div>
        <SkillsGroupedTags />
      </div>
    </SkillsInteractionProvider>
  );
}
