"use client";

import { NYANCAT_KEYFRAMES_CSS } from "@/features/nyancat";
import { FlyingNyancat } from "@/features/nyancat/client";

interface HeaderNyancatProps {
  isMotionActive: boolean;
}

/**
 * Header flight path wiring. Keyframe CSS comes from `@/features/nyancat` lib.
 *
 * Flight is split into two layers so the trail stays level:
 * - nyancat-fly: uniform X + sine Y (2.5 cycles); delayed copies form the rainbow.
 * - nyancat-bank: tilt/scale on the cat only, phase-locked to Y.
 * Both animations are 18s linear so they stay in sync.
 */
export function HeaderNyancat({ isMotionActive }: HeaderNyancatProps): React.JSX.Element {
  return (
    <>
      <FlyingNyancat
        size="xlarge"
        position={{ top: "20%", left: "-150px" }}
        animationName="nyancat-fly"
        animationDuration="18s"
        zIndex={1}
        isMotionActive={isMotionActive}
        bankAnimationName="nyancat-bank"
        testId="header-nyancat"
      />
      <style dangerouslySetInnerHTML={{ __html: NYANCAT_KEYFRAMES_CSS }} />
    </>
  );
}
