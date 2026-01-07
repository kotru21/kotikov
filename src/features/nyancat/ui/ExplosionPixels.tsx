import React from "react";

import type { Pixel, Position } from "../types";

interface ExplosionPixelsProps {
  pixels: Pixel[];
  explosionPosition: Position;
}

export const ExplosionPixels: React.FC<ExplosionPixelsProps> = ({
  pixels,
  explosionPosition,
}) => (
  <>
    {pixels.map((pixel) => (
      <div
        key={pixel.id}
        className={pixel.shape === "circle" ? "rounded-full" : ""}
        style={{
          position: "fixed",
          top: `${explosionPosition.y + pixel.y}px`,
          left: `${explosionPosition.x + pixel.x}px`,
          width: `${pixel.size}px`,
          height: `${pixel.size}px`,
          backgroundColor: pixel.color,
          transform: `translate(-50%, -50%) rotate(${pixel.rotation}deg)`,
          clipPath:
            pixel.shape === "triangle"
              ? "polygon(50% 0%, 0% 100%, 100% 100%)"
              : undefined,
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />
    ))}
  </>
);
