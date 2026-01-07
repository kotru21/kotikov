import React from "react";

import { colors } from "@/styles/colors";

interface TimelinePointProps {
  type: "work" | "education" | "project" | "hackathon";
  index: number;
}

const TimelinePoint: React.FC<TimelinePointProps> = ({ type, index }) => {
  const getTypeColor = (type: string): { backgroundColor: string } => {
    switch (type) {
      case "work":
        return { backgroundColor: colors.neutral[700] };
      case "education":
        return { backgroundColor: colors.semantic.info.DEFAULT };
      case "project":
        return { backgroundColor: colors.semantic.success.DEFAULT };
      case "hackathon":
        return { backgroundColor: colors.semantic.warning.DEFAULT };
      default:
        return { backgroundColor: colors.neutral[500] };
    }
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case "work":
        return "💼";
      case "education":
        return "🎓";
      case "project":
        return "🚀";
      case "hackathon":
        return "⚡";
      default:
        return "•";
    }
  };

  const getWaveOffset = (index: number): number => {
    // Создаем волнообразное смещение для каждой точки, соответствующее SVG волне
    const wavePattern = [0, -20, 20, -20, 20]; // Смещения в пикселях для более выраженной волны
    return wavePattern[index % wavePattern.length] ?? 0;
  };

  return (
    <div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{
        top: `calc(50% + ${String(getWaveOffset(index))}px)`,
      }}>
      <div
        className="w-8 h-8 rounded-full border-4 border-white dark:border-neutral-900 shadow-lg flex items-center justify-center transition-transform duration-300 hover:scale-125"
        style={getTypeColor(type)}>
        <span className="text-sm">{getTypeIcon(type)}</span>
      </div>
    </div>
  );
};

export default TimelinePoint;
