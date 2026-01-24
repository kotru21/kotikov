import React from "react";

import { BauhausGridPattern, GridPaintOverlay, type GridPaintOverlayRef } from "@/shared/ui";

interface HeaderBackgroundProps {
  paintRef?: React.Ref<GridPaintOverlayRef>;
}

const HeaderBackground: React.FC<HeaderBackgroundProps> = ({ paintRef }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* 1. Сетка (Grid Paper) */}
      <BauhausGridPattern className="text-black dark:text-white" opacity={0.05} size={40} />

      {paintRef ? (
        <GridPaintOverlay
          ref={paintRef}
          pixelSize={40}
          brushRadius={52}
          alpha={0.85}
          className="pointer-events-none absolute inset-0 h-full w-full mix-blend-multiply dark:mix-blend-screen"
        />
      ) : null}

      <div className="absolute top-[15%] left-0 h-px w-full bg-black/10 dark:bg-white/10" />
      <div className="absolute top-[85%] left-0 h-px w-full bg-black/10 dark:bg-white/10" />
      <div className="absolute top-0 left-[20%] h-full w-px bg-black/10 dark:bg-white/10" />
      <div className="absolute top-0 right-[20%] h-full w-px bg-black/10 dark:bg-white/10" />
    </div>
  );
};

export default HeaderBackground;
