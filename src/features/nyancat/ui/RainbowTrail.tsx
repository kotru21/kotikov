import React from "react";

import { type NyancatSize, SIZE_CONFIG } from "../lib/constants";
import {
  calculateTrailHeight,
  calculateTrailOpacity,
  calculateTrailTransform,
  calculateTrailWidth,
  generateTrailGradient,
} from "../lib/utils";

interface RainbowTrailProps {
  size: NyancatSize;
  position: {
    top: string;
    left: string;
  };
  animationName: string;
  animationDuration: string;
  animationDelay: string;
  zIndex: number;
  isMotionActive?: boolean;
}

export function RainbowTrail({
  size,
  position,
  animationName,
  animationDuration,
  animationDelay,
  zIndex,
  isMotionActive = true,
}: RainbowTrailProps): React.JSX.Element {
  const config = SIZE_CONFIG[size];

  return (
    <>
      {Array.from({ length: config.trailSegments }, (_, i) => (
        <div
          key={`trail-${String(i)}`}
          data-motion-active={isMotionActive}
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
            zIndex: zIndex - 1,
            animation: `${animationName} ${animationDuration} linear infinite`,
            animationDelay: `${String(parseFloat(animationDelay) + i * config.trailDelay)}s`,
            animationPlayState: isMotionActive ? "running" : "paused",
            opacity: calculateTrailOpacity(i, size),
            willChange: isMotionActive ? "transform" : "auto",
            backfaceVisibility: "hidden",
          }}
        >
          <div
            style={{
              width: `${String(calculateTrailWidth(size))}px`,
              height: `${String(calculateTrailHeight(size))}px`,
              background: generateTrailGradient(i),
              transform: calculateTrailTransform(i, size),
            }}
          />
        </div>
      ))}
    </>
  );
}
