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

      {/* 1.1 Закрашивание сетки (интерактивный слой). pointer-events:none чтобы не ломать клики */}
      {paintRef && (
        <GridPaintOverlay
          ref={paintRef}
          // 1-в-1 с BauhausGridPattern (backgroundSize)
          pixelSize={40}
          // чуть больше клетки, чтобы мазок был "как в контактах" и без дырок
          brushRadius={52}
          // в тёмной теме сделаем мягче за счёт screen
          alpha={0.85}
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply dark:mix-blend-screen"
        />
      )}

      {/* 2. Плавающие фигуры (Bauhaus Shapes) */}
      
      {/* КРУГ (Красный) - Верхний правый угол */}
      <div 
        className="absolute top-10 right-[10%] w-64 h-64 md:w-96 md:h-96 rounded-full bg-primary-500 mix-blend-multiply dark:mix-blend-screen opacity-60 blur-3xl animate-pulse"
        style={{ animationDuration: "8s" }}
      />

      {/* КВАДРАТ (Синий) - Слева, слегка повернутый */}
      <div 
        className="absolute top-[20%] left-[5%] w-48 h-48 md:w-72 md:h-72 bg-primary-700 rotate-12 mix-blend-multiply dark:mix-blend-screen opacity-60 blur-3xl animate-pulse"
        style={{ animationDelay: "2s", animationDuration: "10s" }}
      />

      {/* Декоративные линии */}
      <div className="absolute top-[15%] left-0 w-full h-px bg-black/10 dark:bg-white/10" />
      <div className="absolute top-[85%] left-0 w-full h-px bg-black/10 dark:bg-white/10" />
      <div className="absolute top-0 left-[20%] w-px h-full bg-black/10 dark:bg-white/10" />
      <div className="absolute top-0 right-[20%] w-px h-full bg-black/10 dark:bg-white/10" />
    </div>
  );
};

export default HeaderBackground;

