import React from "react";

import type { Pixel, Position } from "../types";

interface ExplosionPixelsProps {
  pixels: Pixel[];
  explosionPosition: Position;
}

export const ExplosionPixels: React.FC<ExplosionPixelsProps> = ({ pixels, explosionPosition }) => (
  <>
    {pixels.map((pixel) => (
      <div
        key={pixel.id}
        className={pixel.shape === "circle" ? "rounded-full" : ""}
        style={{
          position: "fixed",
          top: `${String(explosionPosition.y + pixel.y)}px`,
          left: `${String(explosionPosition.x + pixel.x)}px`,
          width: `${String(pixel.size)}px`,
          height: `${String(pixel.size)}px`,
          backgroundColor: pixel.color,
          transform: `translate(-50%, -50%) rotate(${String(pixel.rotation)}deg)`,
          clipPath: pixel.shape === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />
    ))}
  </>
);
