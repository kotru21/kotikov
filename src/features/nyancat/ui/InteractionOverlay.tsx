import React from "react";

import { type NyancatSize, SIZE_CONFIG } from "../lib/constants";

interface InteractionOverlayProps {
  size: NyancatSize;
  position: {
    top: string;
    left: string;
  };
  animationName: string;
  animationDuration: string;
  animationDelay: string;
  isMobile: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
  isMotionActive?: boolean;
}

export const InteractionOverlay: React.FC<InteractionOverlayProps> = ({
  size,
  position,
  animationName,
  animationDuration,
  animationDelay,
  isMobile,
  onMouseEnter,
  onClick,
  isMotionActive = true,
}) => {
  const config = SIZE_CONFIG[size];

  return (
    <div
      aria-hidden="true"
      data-motion-active={isMotionActive}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        width: `${String(config.width)}px`,
        height: `${String(config.height)}px`,
        zIndex: 10,
        backgroundColor: "transparent",
        cursor: isMobile ? "pointer" : "default",
        animation: `${animationName} ${animationDuration} linear infinite`,
        animationDelay,
        animationPlayState: isMotionActive ? "running" : "paused",
        pointerEvents: "auto",
      }}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      onTouchStart={onClick}
    />
  );
};
