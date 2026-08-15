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

interface AttachedRainbowTrailProps {
  size: NyancatSize;
  isMotionActive?: boolean;
}

function TrailBand({ index, size }: { index: number; size: NyancatSize }): React.JSX.Element {
  return (
    <div
      style={{
        width: `${String(calculateTrailWidth(size))}px`,
        height: `${String(calculateTrailHeight(size))}px`,
        background: generateTrailGradient(index),
        transform: calculateTrailTransform(index, size),
      }}
    />
  );
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
          <TrailBand index={i} size={size} />
        </div>
      ))}
    </>
  );
}

/** Cape trail that rides the cursor-follow transform (no CSS flight path). */
export function AttachedRainbowTrail({
  size,
  isMotionActive = true,
}: AttachedRainbowTrailProps): React.JSX.Element {
  const config = SIZE_CONFIG[size];

  return (
    <>
      {Array.from({ length: config.trailSegments }, (_, i) => (
        <div
          key={`trail-${String(i)}`}
          data-nyancat-trail
          data-motion-active={isMotionActive}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -1,
            pointerEvents: "none",
            opacity: calculateTrailOpacity(i, size),
            willChange: isMotionActive ? "transform" : "auto",
            backfaceVisibility: "hidden",
          }}
        >
          <TrailBand index={i} size={size} />
        </div>
      ))}
    </>
  );
}
