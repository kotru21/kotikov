"use client";

import React, { useCallback, useRef } from "react";

import type { SkillData } from "@/entities/skill";
import { useRafWhile } from "@/features/performance";

import { SkillMarqueeCard } from ".";

interface SkillMarqueeRowProps {
  speed?: number;
  direction?: "left" | "right";
  skills: readonly SkillData[];
  curved?: boolean;
  arcHeight?: number;
  isMotionActive: boolean;
}

function getArcLift(
  cardCenterX: number,
  containerLeft: number,
  containerWidth: number,
  maxLift: number
): number {
  if (containerWidth <= 0 || maxLift <= 0) return 0;

  const u = Math.max(0, Math.min(1, (cardCenterX - containerLeft) / containerWidth));
  const baseline = 110;
  const controlY = 10;
  const y = (1 - u) * (1 - u) * baseline + 2 * u * (1 - u) * controlY + u * u * baseline;
  const peakDelta = baseline - (0.25 * baseline + 0.5 * controlY + 0.25 * baseline);

  return ((baseline - y) / peakDelta) * maxLift;
}

const SkillMarqueeRow: React.FC<SkillMarqueeRowProps> = ({
  speed = 40,
  direction = "left",
  skills,
  curved = false,
  arcHeight = 72,
  isMotionActive,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeClassName =
    direction === "left" ? "flex gap-6 animate-scroll-left" : "flex gap-6 animate-scroll-right";
  const curvedMarqueeClassName =
    direction === "left"
      ? "flex items-end gap-5 md:gap-6 animate-scroll-left"
      : "flex items-end gap-5 md:gap-6 animate-scroll-right";

  const totalCopies = 4;
  const skillsCopies = Array.from({ length: totalCopies }, (_, copyIndex) =>
    skills.map((skill, index) => ({
      ...skill,
      uniqueKey: `${String(copyIndex)}-${String(index)}-${String(skill.id)}`,
    }))
  ).flat();

  const updateArc = useCallback((): void => {
    const container = containerRef.current;
    if (container === null) return;

    const rect = container.getBoundingClientRect();

    container.querySelectorAll<HTMLElement>("[data-skill-arc-item]").forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenterX = itemRect.left + itemRect.width / 2;
      const lift = getArcLift(itemCenterX, rect.left, rect.width, arcHeight);
      item.style.transform = `translate3d(0, ${String(-lift)}px, 0)`;
    });
  }, [arcHeight]);

  useRafWhile(curved && isMotionActive, updateArc);

  const trackStyle: React.CSSProperties = {
    animationDuration: `${String(speed)}s`,
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationPlayState: isMotionActive ? "running" : "paused",
    width: "max-content",
  };

  if (!curved) {
    return (
      <div className="relative overflow-hidden py-2">
        <div
          data-testid="skill-marquee-track"
          data-motion-active={isMotionActive}
          className={marqueeClassName}
          style={trackStyle}
        >
          {skillsCopies.map((skill) => (
            <SkillMarqueeCard key={skill.uniqueKey} skill={skill} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-x-clip pb-8"
      style={{ paddingTop: `calc(${String(arcHeight)}px + 1.25rem)` }}
    >
      <div
        data-testid="skill-marquee-track"
        data-motion-active={isMotionActive}
        className={curvedMarqueeClassName}
        style={trackStyle}
      >
        {skillsCopies.map((skill) => (
          <div
            key={skill.uniqueKey}
            data-skill-arc-item
            className={isMotionActive ? "will-change-transform" : undefined}
          >
            <SkillMarqueeCard skill={skill} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillMarqueeRow;
