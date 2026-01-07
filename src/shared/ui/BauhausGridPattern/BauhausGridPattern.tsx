import React from "react";

interface BauhausGridPatternProps {
  className?: string;
  size?: number;
  opacity?: number;
}

const BauhausGridPattern: React.FC<BauhausGridPatternProps> = ({
  className = "",
  size = 40,
  opacity = 0.05,
}) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      style={{
        backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                          linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
        backgroundSize: `${String(size)}px ${String(size)}px`,
        opacity: opacity,
      }} />
  );
};

export default BauhausGridPattern;
