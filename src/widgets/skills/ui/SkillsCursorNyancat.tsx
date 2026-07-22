"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { useRafWhile } from "@/features/performance";

import { useSkillsInteraction } from "../model/SkillsInteractionContext";

interface SkillsCursorNyancatProps {
  containerRef: React.RefObject<HTMLElement | null>;
  isMotionActive: boolean;
}

const JUMP_DURATION = 500;
const JUMP_HEIGHT = 100;
const DISTANCE_THRESHOLD = 60;

const SkillsCursorNyancat: React.FC<SkillsCursorNyancatProps> = ({
  containerRef,
  isMotionActive,
}) => {
  const catRef = useRef<HTMLDivElement>(null);

  const currentPos = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });

  const jumpStartTime = useRef(0);
  const isJumping = useRef(false);
  const jumpTargetElement = useRef<HTMLElement | null>(null);
  const jumpTargetPos = useRef<{ x: number; y: number } | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isFacingRight, setIsFacingRight] = useState(true);

  const { activeElement } = useSkillsInteraction();
  const activeElementRef = useRef(activeElement);

  useEffect(() => {
    activeElementRef.current = activeElement;
  }, [activeElement]);

  const shouldAnimate = isMotionActive && isVisible;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent): void => {
      const rect = container.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseEnter = (): void => {
      setIsVisible(true);
    };

    const handleMouseLeave = (): void => {
      setIsVisible(false);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [containerRef]);

  const animate = useCallback(
    (time: number): void => {
      if (!catRef.current || !containerRef.current) return;

      const active = activeElementRef.current;
      const pos = mousePosRef.current;
      const targetX = pos.x;
      const targetY = pos.y;

      let effectiveTargetX = targetX;
      let effectiveTargetY = targetY;

      if (isJumping.current) {
        if (jumpTargetElement.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const elRect = jumpTargetElement.current.getBoundingClientRect();
          effectiveTargetX = elRect.left - containerRect.left + elRect.width / 2;
          effectiveTargetY = elRect.top - containerRect.top;
        } else if (jumpTargetPos.current) {
          effectiveTargetX = jumpTargetPos.current.x;
          effectiveTargetY = jumpTargetPos.current.y;
        }
      } else if (active) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const elRect = active.getBoundingClientRect();
        effectiveTargetX = elRect.left - containerRect.left + elRect.width / 2;
        effectiveTargetY = elRect.top - containerRect.top;
      }

      const dx = effectiveTargetX - currentPos.current.x;
      const dy = effectiveTargetY - currentPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (!isJumping.current && dist > DISTANCE_THRESHOLD) {
        isJumping.current = true;
        jumpStartTime.current = time;
        startPos.current = { ...currentPos.current };

        if (active) {
          jumpTargetElement.current = active;
          jumpTargetPos.current = null;
        } else {
          jumpTargetElement.current = null;
          jumpTargetPos.current = { x: pos.x, y: pos.y };
        }

        setIsFacingRight(effectiveTargetX > currentPos.current.x);
      } else if (!isJumping.current) {
        const lerpFactor = 0.15;
        currentPos.current.x += (effectiveTargetX - currentPos.current.x) * lerpFactor;
        currentPos.current.y += (effectiveTargetY - currentPos.current.y) * lerpFactor;

        if (Math.abs(dx) > 2) {
          setIsFacingRight(dx > 0);
        }
      } else {
        const timeElapsed = time - jumpStartTime.current;
        const progress = Math.min(timeElapsed / JUMP_DURATION, 1);
        const ease = progress;

        const linearX = startPos.current.x + (effectiveTargetX - startPos.current.x) * ease;
        const linearY = startPos.current.y + (effectiveTargetY - startPos.current.y) * ease;
        const jumpY = -Math.sin(progress * Math.PI) * JUMP_HEIGHT;

        currentPos.current.x = linearX;
        currentPos.current.y = linearY + jumpY;

        if (progress >= 1) {
          isJumping.current = false;
          jumpTargetElement.current = null;
          jumpTargetPos.current = null;
        }
      }

      const x = currentPos.current.x - 25;
      const y = currentPos.current.y - 25;
      catRef.current.style.transform = `translate3d(${String(x)}px, ${String(y)}px, 0)`;
    },
    [containerRef]
  );

  useRafWhile(shouldAnimate, animate);

  return (
    <div
      ref={catRef}
      data-skills-decorative-motion
      className={`pointer-events-none absolute top-0 left-0 z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        willChange: shouldAnimate ? "transform" : undefined,
      }}
    >
      <div
        className="relative transition-transform duration-200"
        style={{
          transform: isFacingRight ? "scaleX(1)" : "scaleX(-1)",
        }}
      >
        <Image src="/nyancat.svg" alt="" width={50} height={33} className="drop-shadow-2xl" />
      </div>
    </div>
  );
};

export default SkillsCursorNyancat;
