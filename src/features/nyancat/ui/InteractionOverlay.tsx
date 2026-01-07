import React from "react";

import type { NyancatSize } from "../lib/constants";
import { SIZE_CONFIG } from "../lib/constants";

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
}) => {
  const config = SIZE_CONFIG[size];

  return (
    <div
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        width: `${config.width}px`,
        height: `${config.height}px`,
        zIndex: 10,
        backgroundColor: "transparent",
        cursor: isMobile ? "pointer" : "default",
        animation: `${animationName} ${animationDuration} linear infinite`,
        animationDelay: animationDelay,
        pointerEvents: "auto",
      }}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      onTouchStart={onClick}
    />
  );
};
