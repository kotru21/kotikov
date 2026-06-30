"use client";

import React, { useEffect, useRef } from "react";

import type { SkillData } from "@/entities/skill";

import { SkillMarqueeCard } from ".";

interface SkillMarqueeRowProps {
  speed?: number;
  direction?: "left" | "right";
  skills: SkillData[];
  curved?: boolean;
  arcHeight?: number;
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
}) => {
  const animationDirection = direction === "left" ? "scroll-left" : "scroll-right";
  const containerRef = useRef<HTMLDivElement>(null);

  const totalCopies = 4;
  const skillsCopies = Array.from({ length: totalCopies }, (_, copyIndex) =>
    skills.map((skill, index) => ({
      ...skill,
      uniqueKey: `${String(copyIndex)}-${String(index)}-${String(skill.id)}`,
    }))
  ).flat();

  useEffect(() => {
    if (!curved) return;

    const container = containerRef.current;
    if (container === null) return;

    let frame = 0;

    const updateArc = (): void => {
      const rect = container.getBoundingClientRect();

      container.querySelectorAll<HTMLElement>("[data-skill-arc-item]").forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2;
        const lift = getArcLift(itemCenterX, rect.left, rect.width, arcHeight);
        item.style.transform = `translate3d(0, ${String(-lift)}px, 0)`;
      });

      frame = window.requestAnimationFrame(updateArc);
    };

    frame = window.requestAnimationFrame(updateArc);
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [arcHeight, curved, skillsCopies.length]);

  if (!curved) {
    return (
      <div className="relative overflow-hidden py-2">
        <div
          className={`flex gap-6 animate-${animationDirection}`}
          style={{
            animationDuration: `${String(speed)}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            width: "max-content",
          }}
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
        className={`flex items-end gap-5 md:gap-6 animate-${animationDirection}`}
        style={{
          animationDuration: `${String(speed)}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          width: "max-content",
        }}
      >
        {skillsCopies.map((skill) => (
          <div key={skill.uniqueKey} data-skill-arc-item className="will-change-transform">
            <SkillMarqueeCard skill={skill} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillMarqueeRow;
