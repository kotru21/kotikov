"use client";

import React, { memo,useCallback } from "react";

import { useIsMobile } from "@/features/device";

import { useExplosion } from "../hooks/useExplosion";
import type { FlyingNyancatProps } from "../types";
import { ExplosionPixels } from "./ExplosionPixels";
import { InteractionOverlay } from "./InteractionOverlay";
import { NyancatImage } from "./NyancatImage";
import { RainbowTrail } from "./RainbowTrail";

const FlyingNyancat: React.FC<FlyingNyancatProps> = memo(
  ({
    size,
    position,
    animationName,
    animationDuration,
    animationDelay = "0s",
    zIndex = -5,
  }) => {
    const isMobile = useIsMobile();
    const { isExploded, pixels, explosionPosition, nyancatRef, explode } =
      useExplosion(size);

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
          }}>
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
            />
          )}
        </div>

        {zIndex < 0 && !isExploded && (
          <InteractionOverlay
            size={size}
            position={position}
            animationName={animationName}
            animationDuration={animationDuration}
            animationDelay={animationDelay}
            isMobile={isMobile}
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
          />
        )}

        {isExploded ? <ExplosionPixels
            pixels={pixels}
            explosionPosition={explosionPosition}
          /> : null}

        {!isExploded && (
          <RainbowTrail
            size={size}
            position={position}
            animationName={animationName}
            animationDuration={animationDuration}
            animationDelay={animationDelay}
            zIndex={zIndex}
          />
        )}
      </>
    );
  }
);

FlyingNyancat.displayName = "FlyingNyancat";

export default FlyingNyancat;
