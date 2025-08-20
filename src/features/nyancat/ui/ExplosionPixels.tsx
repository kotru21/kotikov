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
        style={{
          position: "fixed",
          top: `${explosionPosition.y + pixel.y}px`,
          left: `${explosionPosition.x + pixel.x}px`,
          width: `${pixel.size}px`,
          height: `${pixel.size}px`,
          backgroundColor: pixel.color,
          zIndex: 9999,
          borderRadius: "1px",
          opacity: 0.9,
          transition: "opacity 0.5s ease-out",
          pointerEvents: "none",
          boxShadow: "0 0 2px rgba(0,0,0,0.3)",
        }}
      />
    ))}
  </>
);
