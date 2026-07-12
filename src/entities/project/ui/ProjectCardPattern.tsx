import type { ProjectCardPattern as PatternType } from "@/shared/config/content";

interface ProjectCardPatternProps {
  pattern: PatternType;
  color: string;
}

/** Decorative corner pattern for project cards (live patterns: dots, chevrons, stripes). */
export function ProjectCardPattern({ pattern, color }: ProjectCardPatternProps): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 bottom-0 h-[62%] w-[58%] overflow-hidden opacity-50 dark:opacity-90"
    >
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
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const startX = 120 + index * 14;
            const startY = 200 - index * 18;

            return (
              <path
                key={`chevron-${String(startX)}-${String(startY)}`}
                d={`M${String(startX)} ${String(startY)} L${String(170 + index * 10)} ${String(170 - index * 18)} L${String(220 + index * 6)} ${String(200 - index * 18)}`}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                opacity={1 - index * 0.12}
              />
            );
          })}
        </svg>
      ) : null}

      {pattern === "stripes" ? (
        <svg viewBox="0 0 240 220" className="h-full w-full" preserveAspectRatio="xMaxYMax meet">
          <circle
            cx="190"
            cy="170"
            r="88"
            fill="none"
            stroke={color}
            strokeWidth="2"
            opacity="0.35"
          />
          {[0, 1, 2, 3, 4].map((index) => {
            const x1 = 130 + index * 18;
            const x2 = 210 + index * 8;

            return (
              <line
                key={`stripe-${String(x1)}-${String(x2)}`}
                x1={x1}
                y1={220}
                x2={x2}
                y2={90}
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                opacity={0.45 + index * 0.1}
              />
            );
          })}
        </svg>
      ) : null}
    </div>
  );
}
