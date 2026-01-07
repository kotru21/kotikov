import React from "react";

import BauhausGridPattern from "@/shared/ui/BauhausGridPattern";

const HeaderBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* 1. Сетка (Grid Paper) */}
      <BauhausGridPattern className="text-black dark:text-white" opacity={0.05} />

      {/* 2. Плавающие фигуры (Bauhaus Shapes) */}
      
      {/* КРУГ (Красный) - Верхний правый угол */}
      <div 
        className="absolute top-10 right-[10%] w-64 h-64 md:w-96 md:h-96 rounded-full bg-[#d12c1f] mix-blend-multiply dark:mix-blend-screen opacity-60 blur-3xl animate-pulse"
        style={{ animationDuration: "8s" }}
      />

      {/* КВАДРАТ (Синий) - Слева, слегка повернутый */}
      <div 
        className="absolute top-[20%] left-[5%] w-48 h-48 md:w-72 md:h-72 bg-[#1b54a7] rotate-12 mix-blend-multiply dark:mix-blend-screen opacity-60 blur-3xl animate-pulse"
        style={{ animationDelay: "2s", animationDuration: "10s" }}
      />

      {/* ТРЕУГОЛЬНИК (Желтый) - Снизу по центру (CSS Triangle) */}
      <div 
        className="absolute bottom-[-10%] left-[40%] w-0 h-0 border-l-100 border-r-100 border-b-173 md:border-l-150 md:border-r-150 md:border-b-260 border-l-transparent border-r-transparent border-b-[#f4bf21] mix-blend-multiply dark:mix-blend-screen opacity-60 blur-3xl animate-pulse"
        style={{ transform: "rotate(-15deg)", animationDelay: "4s", animationDuration: "12s" }}
      />

      {/* Декоративные линии */}
      <div className="absolute top-[15%] left-0 w-full h-px-black/10 dark:bg-white/10" />
      <div className="absolute top-[85%] left-0 w-full h-px bg-black/10 dark:bg-white/10" />
      <div className="absolute top-0 left-[20%] w-px h-full bg-black/10 dark:bg-white/10" />
      <div className="absolute top-0 right-[20%] w-px h-full bg-black/10 dark:bg-white/10" />
    </div>
  );
};

export default HeaderBackground;
