import React from "react";

import type { ProjectCardPattern as PatternType } from "@/shared/config/content";

interface ProjectCardPatternProps {
  pattern: PatternType;
  color: string;
}

const ProjectCardPattern: React.FC<ProjectCardPatternProps> = ({ pattern, color }) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 bottom-0 h-[62%] w-[58%] overflow-hidden opacity-50 dark:opacity-90"
    >
      {pattern === "waves" ? (
        <svg viewBox="0 0 240 220" className="h-full w-full" preserveAspectRatio="xMaxYMax meet">
          <path
            d="M20 180c40-30 80-10 120-40s80-20 100 10"
            fill="none"
            stroke={color}
            strokeWidth="3"
          />
          <path
            d="M0 210c50-35 95-15 140-45s85-25 110 5"
            fill="none"
            stroke={color}
            strokeWidth="3"
          />
          <path
            d="M35 150c35-25 70-8 105-30s65-18 85 8"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            opacity="0.65"
          />
        </svg>
      ) : null}

      {pattern === "dots" ? (
        <svg viewBox="0 0 240 220" className="h-full w-full" preserveAspectRatio="xMaxYMax meet">
          {[
            [170, 40, 4],
            [190, 70, 3],
            [155, 95, 5],
            [205, 110, 3],
            [175, 135, 4],
            [145, 160, 3],
            [200, 175, 5],
            [165, 195, 3],
            [215, 205, 4],
            [130, 120, 2],
            [220, 55, 2],
          ].map(([cx, cy, r]) => (
            <circle key={`${String(cx)}-${String(cy)}`} cx={cx} cy={cy} r={r} fill={color} />
          ))}
        </svg>
      ) : null}

      {pattern === "chevrons" ? (
        <svg viewBox="0 0 240 220" className="h-full w-full" preserveAspectRatio="xMaxYMax meet">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <path
              key={index}
              d={`M${String(120 + index * 14)} ${String(200 - index * 18)} L${String(170 + index * 10)} ${String(170 - index * 18)} L${String(220 + index * 6)} ${String(200 - index * 18)}`}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              opacity={1 - index * 0.12}
            />
          ))}
        </svg>
      ) : null}

      {pattern === "stripes" ? (
        <svg viewBox="0 0 240 220" className="h-full w-full" preserveAspectRatio="xMaxYMax meet">
          <circle cx="190" cy="170" r="88" fill="none" stroke={color} strokeWidth="2" opacity="0.35" />
          {[0, 1, 2, 3, 4].map((index) => (
            <line
              key={index}
              x1={130 + index * 18}
              y1={220}
              x2={210 + index * 8}
              y2={90}
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              opacity={0.45 + index * 0.1}
            />
          ))}
        </svg>
      ) : null}

      {pattern === "scatter" ? (
        <svg viewBox="0 0 240 220" className="h-full w-full" preserveAspectRatio="xMaxYMax meet">
          {[
            [160, 60, 12, 4],
            [200, 90, -20, 3],
            [140, 120, 35, 3],
            [210, 150, -10, 4],
            [175, 180, 25, 3],
            [130, 190, -30, 2],
            [220, 200, 15, 3],
          ].map(([x, y, angle, len], index) => (
            <line
              key={index}
              x1={x}
              y1={y}
              x2={x + len * Math.cos((angle * Math.PI) / 180)}
              y2={y + len * Math.sin((angle * Math.PI) / 180)}
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
        </svg>
      ) : null}
    </div>
  );
};

export default ProjectCardPattern;
