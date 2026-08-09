"use client";

import Image from "next/image";
import type { Ref, TouchEvent } from "react";

import { type NyancatSize, SIZE_CONFIG } from "../lib/constants";

interface NyancatImageProps {
  size: NyancatSize;
  animationName: string;
  animationDuration: string;
  animationDelay: string;
  isMobile: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
  forwardRef?: Ref<HTMLButtonElement | null>;
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

  const handleTouchEnd = (e: TouchEvent<HTMLButtonElement>): void => {
    // Prevent the following synthetic click so explode() runs once per tap.
    e.preventDefault();
    onClick();
  };

  return (
    <button
      type="button"
      ref={forwardRef}
      aria-label="Взорвать нянкэта"
      data-testid={testId}
      data-motion-active={isMotionActive}
      className="appearance-none border-0 bg-transparent p-0"
      style={{
        display: "block",
        margin: 0,
        font: "inherit",
        color: "inherit",
        lineHeight: 1,
        animation: `${animationName} ${animationDuration} linear infinite`,
        animationDelay,
        animationPlayState: isMotionActive ? "running" : "paused",
        cursor: isMobile ? "pointer" : "default",
        willChange: isMotionActive ? "transform" : "auto",
        backfaceVisibility: "hidden",
      }}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      onTouchEnd={handleTouchEnd}
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
    </button>
  );
}
