"use client";

import React, { memo, useCallback } from "react";

import { useIsMobile } from "@/features/device";

import { useExplosion } from "../hooks/useExplosion";
import type { FlyingNyancatProps } from "../types";
import { ExplosionPixels } from "./ExplosionPixels";
import { NyancatImage } from "./NyancatImage";
import { RainbowTrail } from "./RainbowTrail";

function FlyingNyancat({
  size,
  position,
  animationName,
  animationDuration,
  animationDelay = "0s",
  zIndex = 1,
  isMotionActive = true,
  bankAnimationName,
  testId,
}: FlyingNyancatProps): React.JSX.Element {
  const isMobile = useIsMobile();
  const { isExploded, pixels, explosionPosition, nyancatRef, explode } = useExplosion(size);

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      explode();
    }
  }, [isMobile, explode]);

  const handleClick = useCallback(() => {
    explode();
  }, [explode]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: position.top,
          left: position.left,
          zIndex,
        }}
      >
        {!isExploded && (
          <NyancatImage
            size={size}
            animationName={animationName}
            animationDuration={animationDuration}
            animationDelay={animationDelay}
            isMobile={isMobile}
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
            forwardRef={nyancatRef}
            isMotionActive={isMotionActive}
            bankAnimationName={bankAnimationName}
            testId={testId}
          />
        )}
      </div>

      {isExploded ? (
        <ExplosionPixels pixels={pixels} explosionPosition={explosionPosition} />
      ) : null}

      {!isExploded && (
        <RainbowTrail
          size={size}
          position={position}
          animationName={animationName}
          animationDuration={animationDuration}
          animationDelay={animationDelay}
          zIndex={zIndex}
          isMotionActive={isMotionActive}
        />
      )}
    </>
  );
}

const FlyingNyancatMemo = memo(FlyingNyancat);
FlyingNyancatMemo.displayName = "FlyingNyancat";

export default FlyingNyancatMemo;
