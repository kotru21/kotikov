"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { resolveNyancatTarget, SIZE_CONFIG, spriteTranslate3d } from "@/features/nyancat";
import {
  AttachedRainbowTrail,
  ExplosionPixels,
  NyancatImage,
  useExplosion,
} from "@/features/nyancat/client";
import { useRafWhile } from "@/features/performance/client";

interface SkillsCursorNyancatProps {
  containerRef: React.RefObject<HTMLElement | null>;
  isMotionActive: boolean;
}

const JUMP_DURATION = 500;
const JUMP_HEIGHT = 100;
const DISTANCE_THRESHOLD = 60;
const LEDGE_SNAP = 12;
const NYANCAT_SIZE = "medium" as const;
const CAT = SIZE_CONFIG[NYANCAT_SIZE];

interface PointerPos {
  x: number;
  y: number;
}

function bindSkillsPointerTracking(
  container: HTMLElement,
  mousePosRef: React.RefObject<PointerPos>,
  setVisible: (visible: boolean) => void
): () => void {
  const updateFromClient = (clientX: number, clientY: number): void => {
    const rect = container.getBoundingClientRect();
    mousePosRef.current = { x: clientX - rect.left, y: clientY - rect.top };
  };

  const onMouseMove = (event: MouseEvent): void => {
    updateFromClient(event.clientX, event.clientY);
  };
  const onTouchMove = (event: TouchEvent): void => {
    const touch = event.touches?.[0];
    if (touch === undefined) return;
    updateFromClient(touch.clientX, touch.clientY);
  };
  const onTouchStart = (event: TouchEvent): void => {
    const touch = event.touches?.[0];
    if (touch !== undefined) {
      updateFromClient(touch.clientX, touch.clientY);
    }
    setVisible(true);
  };
  const show = (): void => {
    setVisible(true);
  };
  const hide = (): void => {
    setVisible(false);
  };

  container.addEventListener("mousemove", onMouseMove);
  container.addEventListener("mouseenter", show);
  container.addEventListener("mouseleave", hide);
  container.addEventListener("touchstart", onTouchStart, { passive: true });
  container.addEventListener("touchmove", onTouchMove, { passive: true });

  return () => {
    container.removeEventListener("mousemove", onMouseMove);
    container.removeEventListener("mouseenter", show);
    container.removeEventListener("mouseleave", hide);
    container.removeEventListener("touchstart", onTouchStart);
    container.removeEventListener("touchmove", onTouchMove);
  };
}

const SkillsCursorNyancat: React.FC<SkillsCursorNyancatProps> = ({
  containerRef,
  isMotionActive,
}) => {
  const catRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const facingRightRef = useRef(true);

  const currentPos = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });

  const jumpStartTime = useRef(0);
  const isJumping = useRef(false);
  const jumpTargetPos = useRef<{ x: number; y: number } | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const { isExploded, pixels, explosionPosition, nyancatRef, explode } = useExplosion(NYANCAT_SIZE);

  const shouldAnimate = isMotionActive && isVisible && !isExploded;

  const handleClick = useCallback((): void => {
    explode();
  }, [explode]);

  const setFacingRight = (next: boolean): void => {
    if (facingRightRef.current === next) return;
    facingRightRef.current = next;
    if (faceRef.current !== null) {
      faceRef.current.style.transform = next ? "scaleX(1)" : "scaleX(-1)";
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    return bindSkillsPointerTracking(container, mousePosRef, setIsVisible);
  }, [containerRef]);

  const animate = useCallback(
    (time: number): void => {
      if (!catRef.current || !containerRef.current) return;

      const pos = mousePosRef.current;
      const target = resolveNyancatTarget(containerRef.current, pos, CAT.width);

      let effectiveTargetX = target.x;
      let effectiveTargetY = target.y;

      if (isJumping.current && !target.perched && jumpTargetPos.current) {
        effectiveTargetX = jumpTargetPos.current.x;
        effectiveTargetY = jumpTargetPos.current.y;
      }

      const dx = effectiveTargetX - currentPos.current.x;
      const dy = effectiveTargetY - currentPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const onLedge = target.perched && Math.abs(currentPos.current.y - target.y) < LEDGE_SNAP;

      if (!isJumping.current && dist > DISTANCE_THRESHOLD && !onLedge) {
        isJumping.current = true;
        jumpStartTime.current = time;
        startPos.current = { ...currentPos.current };
        jumpTargetPos.current = target.perched ? null : { x: pos.x, y: pos.y };
        setFacingRight(effectiveTargetX > currentPos.current.x);
      } else if (!isJumping.current) {
        const lerpFactor = onLedge ? 0.28 : 0.15;
        currentPos.current.x += (effectiveTargetX - currentPos.current.x) * lerpFactor;
        currentPos.current.y += (effectiveTargetY - currentPos.current.y) * lerpFactor;

        if (Math.abs(dx) > 2) {
          setFacingRight(dx > 0);
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
          jumpTargetPos.current = null;
        }
      }

      catRef.current.style.transform = spriteTranslate3d(currentPos.current, CAT, target.perched);
    },
    [containerRef]
  );

  useRafWhile(shouldAnimate, animate);

  return (
    <>
      <div
        ref={catRef}
        data-skills-decorative-motion
        className={`pointer-events-none absolute top-0 left-0 z-20 transition-opacity duration-300 focus-within:opacity-100 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          willChange: shouldAnimate ? "transform" : undefined,
        }}
      >
        {!isExploded ? (
          <div
            ref={faceRef}
            className="relative transition-transform duration-200"
            style={{ transform: "scaleX(1)" }}
          >
            <AttachedRainbowTrail size={NYANCAT_SIZE} isMotionActive={shouldAnimate} />
            <div className={isVisible ? "pointer-events-auto" : "pointer-events-none"}>
              <NyancatImage
                size={NYANCAT_SIZE}
                isMobile
                onClick={handleClick}
                forwardRef={nyancatRef}
                flightAnimated={false}
                isMotionActive={isMotionActive}
                testId="skills-nyancat"
              />
            </div>
          </div>
        ) : null}
      </div>
      {isExploded ? (
        <ExplosionPixels pixels={pixels} explosionPosition={explosionPosition} />
      ) : null}
    </>
  );
};

export default SkillsCursorNyancat;
