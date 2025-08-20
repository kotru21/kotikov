import React from "react";
import { colors } from "@/styles/colors";

const TimelineWave: React.FC = () => {
  return (
    <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-0">
      <svg
        className="w-full h-20"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.primary[300]} />
            <stop offset="50%" stopColor={colors.accent.purple[400]} />
            <stop offset="100%" stopColor={colors.accent.pink[400]} />
          </linearGradient>
        </defs>
        <path
          d="M0,40 Q100,20 200,40 Q300,60 400,40 Q500,20 600,40 Q700,60 800,40 Q900,20 1000,40 Q1100,60 1200,40"
          stroke="url(#waveGradient)"
          strokeWidth="4"
          fill="none"
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
};

export default TimelineWave;
