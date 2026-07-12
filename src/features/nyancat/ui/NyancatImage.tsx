"use client";

import Image from "next/image";
import type { RefObject } from "react";

import { type NyancatSize, SIZE_CONFIG } from "../lib/constants";

interface NyancatImageProps {
  size: NyancatSize;
  animationName: string;
  animationDuration: string;
  animationDelay: string;
  isMobile: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
  forwardRef?: RefObject<HTMLDivElement | null>;
  priority?: boolean;
  isMotionActive?: boolean;
  bankAnimationName?: string;
  testId?: string;
}

export function NyancatImage({
  size,
  animationName,
  animationDuration,
  animationDelay,
  isMobile,
  onMouseEnter,
  onClick,
  forwardRef,
  priority = false,
  isMotionActive = true,
  bankAnimationName,
  testId,
}: NyancatImageProps): React.JSX.Element {
  const config = SIZE_CONFIG[size];

  const image = (
    <Image
      src="/nyancat.svg"
      alt=""
      width={config.width}
      height={config.height}
      priority={priority}
      style={{
        width: `${String(config.width)}px`,
        height: "auto",
      }}
    />
  );

  return (
    <div
      ref={forwardRef}
      aria-hidden="true"
      data-testid={testId}
      data-motion-active={isMotionActive}
      style={{
        animation: `${animationName} ${animationDuration} linear infinite`,
        animationDelay,
        animationPlayState: isMotionActive ? "running" : "paused",
        cursor: isMobile ? "pointer" : "default",
        willChange: isMotionActive ? "transform" : "auto",
        backfaceVisibility: "hidden",
      }}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      onTouchStart={onClick}
    >
      {bankAnimationName !== undefined && bankAnimationName !== "" ? (
        <div
          style={{
            animation: `${bankAnimationName} ${animationDuration} linear infinite`,
            animationDelay,
            animationPlayState: isMotionActive ? "running" : "paused",
            transformOrigin: "center",
            willChange: isMotionActive ? "transform" : "auto",
            backfaceVisibility: "hidden",
          }}
        >
          {image}
        </div>
      ) : (
        image
      )}
    </div>
  );
}
