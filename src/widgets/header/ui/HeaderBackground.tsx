import React from "react";

import { BauhausGridPattern, GridPaintOverlay, type GridPaintOverlayRef } from "@/shared/ui";

interface HeaderBackgroundProps {
  paintRef?: React.Ref<GridPaintOverlayRef>;
}

const HeaderBackground: React.FC<HeaderBackgroundProps> = ({ paintRef }) => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* 1. Сетка (Grid Paper) */}
      <BauhausGridPattern
        className="text-black dark:text-white"
        opacity={0.05}
        size={40}
      />

      {paintRef && (
        <GridPaintOverlay
          ref={paintRef}
          pixelSize={40}
          brushRadius={52}
          alpha={0.85}
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply dark:mix-blend-screen"
        />
      )}

      <div className="absolute top-[15%] left-0 w-full h-px bg-black/10 dark:bg-white/10" />
      <div className="absolute top-[85%] left-0 w-full h-px bg-black/10 dark:bg-white/10" />
      <div className="absolute top-0 left-[20%] w-px h-full bg-black/10 dark:bg-white/10" />
      <div className="absolute top-0 right-[20%] w-px h-full bg-black/10 dark:bg-white/10" />
    </div>
  );
};

export default HeaderBackground;

