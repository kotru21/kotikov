"use client";

import Image from "next/image";
import React from "react";

import type { NyancatSize } from "../lib/constants";
import { SIZE_CONFIG } from "../lib/constants";

interface NyancatImageProps {
  size: NyancatSize;
  animationName: string;
  animationDuration: string;
  animationDelay: string;
  isMobile: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
  forwardRef?: React.RefObject<HTMLDivElement | null>;
  priority?: boolean;
}

export const NyancatImage: React.FC<NyancatImageProps> = ({
  size,
  animationName,
  animationDuration,
  animationDelay,
  isMobile,
  onMouseEnter,
  onClick,
  forwardRef,
  priority = false,
}) => {
  const config = SIZE_CONFIG[size];

  return (
    <div
      ref={forwardRef}
      style={{
        animation: `${animationName} ${animationDuration} linear infinite`,
        animationDelay: animationDelay,
        cursor: isMobile ? "pointer" : "default",
      }}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      onTouchStart={onClick}>
      <Image
        src="/nyancat.svg"
        alt="Nyancat"
        width={config.width}
        height={config.height}
        priority={priority}
        style={{
          width: `${String(config.width)}px`,
          height: "auto",
        }}
      />
    </div>
  );
};
