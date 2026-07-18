"use client";

import React, { useRef, useState } from "react";
import { FaLinkedinIn } from "react-icons/fa";

import { useSceneMotionPolicy } from "@/features/performance";
import { skillsData, social } from "@/shared/config/content";
import { formatExternalLinkLabel } from "@/shared/lib";
import { Button } from "@/shared/ui";

import { SkillMarqueeRow, SkillsGroupedTags } from ".";
import { SkillsSectionIntro, useShowSkillsMarquee } from "./SkillsSectionIntro";

interface SkillsMobileViewProps {
  headingId: string;
}

const SkillsMobileView: React.FC<SkillsMobileViewProps> = ({ headingId }) => {
  const showMarquee = useShowSkillsMarquee();

  const mid = Math.ceil(skillsData.length / 2);
  const firstRow = skillsData.slice(0, mid);
  const secondRow = skillsData.slice(mid);

  const rowsRef = useRef<HTMLDivElement | null>(null);
  const motion = useSceneMotionPolicy(rowsRef, { dominantEffect: "marquee" });
  const [visible, setVisible] = useState(false);

  // One-shot latch: adjust state during render (not in an effect).
  if (motion.isInView && !visible) {
    setVisible(true);
  }

  return (
    <div role="group" aria-labelledby={headingId}>
      <SkillsSectionIntro
        headingId={headingId}
        className="px-6"
        stackClassName="text-text-secondary mx-auto -mt-4 mb-8 max-w-sm text-center text-base font-semibold dark:text-neutral-300"
      />

      <div className="flex justify-center px-6 pb-8">
        <Button
          href={social.linkedin.url}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="lg"
          aria-label={formatExternalLinkLabel("Смотреть мой LinkedIn")}
        >
          <FaLinkedinIn className="text-xl" aria-hidden="true" />
          <span>Смотреть мой LinkedIn</span>
        </Button>
      </div>

      {/* Бегущие строки скиллов — въезжают при появлении во вьюпорте; только при включённой анимации */}
      {showMarquee ? (
        <div
          ref={rowsRef}
          data-skills-decorative-motion
          className="flex flex-col gap-2"
        >
          <div
            style={{
              transform: visible ? "translateX(0)" : "translateX(-100%)",
              opacity: visible ? 1 : 0,
              transition: "transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.5s ease",
            }}
          >
            <SkillMarqueeRow
              curved
              arcHeight={44}
              skills={firstRow}
              speed={35}
              direction="left"
              isMotionActive={motion.canRunContinuous}
            />
          </div>
          <div
            style={{
              transform: visible ? "translateX(0)" : "translateX(100%)",
              opacity: visible ? 1 : 0,
              transition:
                "transform 0.7s 0.1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.5s 0.1s ease",
            }}
          >
            <SkillMarqueeRow
              curved
              arcHeight={44}
              skills={secondRow}
              speed={45}
              direction="right"
              isMotionActive={motion.canRunContinuous}
            />
          </div>
        </div>
      ) : null}

      <div className="px-6">
        <SkillsGroupedTags />
      </div>
    </div>
  );
};

export default SkillsMobileView;
