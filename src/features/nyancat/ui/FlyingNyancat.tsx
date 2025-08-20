import React, { useCallback, memo } from "react";
import { useIsMobile } from "@/features/device/useIsMobile";
import { useExplosion } from "../hooks/useExplosion";
import { ExplosionPixels } from "./ExplosionPixels";
import { RainbowTrail } from "./RainbowTrail";
import { NyancatImage } from "./NyancatImage";
import { InteractionOverlay } from "./InteractionOverlay";
import type { FlyingNyancatProps } from "../types";

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
            zIndex: zIndex,
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

        {isExploded && (
          <ExplosionPixels
            pixels={pixels}
            explosionPosition={explosionPosition}
          />
        )}

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
