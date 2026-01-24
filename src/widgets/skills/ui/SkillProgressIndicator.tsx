import React from "react";

import { colors } from "@/styles/colors";

interface SkillProgressIndicatorProps {
  activeIndex: number;
  totalItems: number;
}

const SkillProgressIndicator: React.FC<SkillProgressIndicatorProps> = ({
  activeIndex,
  totalItems,
}) => {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform">
      <div className="flex gap-3">
        {Array.from({ length: totalItems }).map((_, index) => (
          <div
            key={`indicator-${String(index)}`}
            className="h-2 w-2 rounded-full transition-all duration-500 ease-out"
            style={{
              backgroundColor: activeIndex === index ? colors.text.primary : colors.neutral[400],
              boxShadow: activeIndex === index ? `0 0 12px ${colors.text.primary}` : "none",
              transform: activeIndex === index ? "scale(1.2)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Текст с номером карточки */}
      <div className="mt-3 text-center">
        <span className="text-sm font-medium" style={{ color: colors.text.secondary }}>
          {activeIndex + 1} / {totalItems}
        </span>
      </div>
    </div>
  );
};

export default SkillProgressIndicator;
