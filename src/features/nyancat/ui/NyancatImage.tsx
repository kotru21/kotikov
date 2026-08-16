"use client";

import Image from "next/image";
import type { Ref, TouchEvent } from "react";

import { type NyancatSize, SIZE_CONFIG } from "../lib/constants";

interface NyancatImageProps {
  size: NyancatSize;
  animationName?: string;
  animationDuration?: string;
  animationDelay?: string;
  isMobile: boolean;
  onMouseEnter?: () => void;
  onClick: () => void;
  forwardRef?: Ref<HTMLButtonElement | null>;
  priority?: boolean;
  isMotionActive?: boolean;
  bankAnimationName?: string;
  /** When false, parent motion (cursor follow) owns transform — no CSS flight. */
  flightAnimated?: boolean;
  testId?: string;
}

export function NyancatImage({
  size,
  animationName,
  animationDuration,
  animationDelay = "0s",
  isMobile,
  onMouseEnter,
  onClick,
  forwardRef,
  priority = false,
  isMotionActive = true,
  bankAnimationName,
  flightAnimated = true,
  testId,
}: NyancatImageProps): React.JSX.Element {
  const config = SIZE_CONFIG[size];
  const playFlight =
    flightAnimated &&
    animationName !== undefined &&
    animationName !== "" &&
    animationDuration !== undefined &&
    animationDuration !== "";

  const image = (
    <Image
      src="/nyancat.svg"
      alt=""
      width={config.width}
      height={config.height}
      unoptimized
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

  const flightPlayState = isMotionActive ? "running" : "paused";
  const bankName = playFlight ? bankAnimationName : undefined;

  return (
    <button
      type="button"
      ref={forwardRef}
      aria-label="Взорвать нянкэта"
      data-testid={testId}
      data-motion-active={isMotionActive}
      className="inline-flex min-h-11 min-w-11 appearance-none items-center justify-center border-0 bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#111] focus-visible:outline-none dark:focus-visible:ring-[#ededed]"
      style={{
        margin: 0,
        font: "inherit",
        color: "inherit",
        lineHeight: 1,
        animation: playFlight
          ? `${animationName} ${animationDuration} linear infinite`
          : undefined,
        animationDelay: playFlight ? animationDelay : undefined,
        animationPlayState: playFlight ? flightPlayState : undefined,
        cursor: isMobile ? "pointer" : "default",
        willChange: playFlight && isMotionActive ? "transform" : "auto",
        backfaceVisibility: "hidden",
      }}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      onTouchEnd={handleTouchEnd}
    >
      {bankName !== undefined && bankName !== "" ? (
        <div
          style={{
            animation: `${bankName} ${animationDuration ?? "0s"} linear infinite`,
            animationDelay,
            animationPlayState: flightPlayState,
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
