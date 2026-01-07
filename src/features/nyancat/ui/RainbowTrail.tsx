import React from "react";

import type { NyancatSize } from "../lib/constants";
import { SIZE_CONFIG } from "../lib/constants";
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
}

export const RainbowTrail: React.FC<RainbowTrailProps> = ({
  size,
  position,
  animationName,
  animationDuration,
  animationDelay,
  zIndex,
}) => {
  const config = SIZE_CONFIG[size];

  return (
    <>
      {Array.from({ length: config.trailSegments }, (_, i) => (
        <div
          key={`trail-${i}`}
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
            zIndex: zIndex - 1,
            animation: `${animationName} ${animationDuration} linear infinite`,
            animationDelay: `${
              parseFloat(animationDelay) + i * config.trailDelay
            }s`,
            opacity: calculateTrailOpacity(i, size),
          }}>
          <div
            style={{
              width: `${calculateTrailWidth(i, size)}px`,
              height: `${calculateTrailHeight(i, size)}px`,
              background: generateTrailGradient(i, size),
              transform: calculateTrailTransform(i, size),
            }}
          />
        </div>
      ))}
    </>
  );
};
