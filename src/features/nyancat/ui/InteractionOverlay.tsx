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
      role="button"
      aria-label="Nyancat interaction"
      tabIndex={0}
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
        pointerEvents: "auto",
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      onTouchStart={onClick}
    />
  );
};
