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

export const RainbowTrail: React.FC<RainbowTrailProps> = ({
  size,
  position,
  animationName,
  animationDuration,
  animationDelay,
  zIndex,
  isMotionActive = true,
}) => {
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
          }}
        >
          <div
            style={{
              width: `${String(calculateTrailWidth(i, size))}px`,
              height: `${String(calculateTrailHeight(i, size))}px`,
              background: generateTrailGradient(i, size),
              transform: calculateTrailTransform(i, size),
            }}
          />
        </div>
      ))}
    </>
  );
};
