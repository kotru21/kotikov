import type { TimelineItem } from "@/entities/timeline";

export function extractYear(period: string): string {
  const match = /\d{4}/.exec(period);
  return match?.[0] ?? period;
}

export function getTypeLabel(type: TimelineItem["type"]): string {
  switch (type) {
    case "work":
      return "Работа";
    case "education":
      return "Обучение";
    case "project":
      return "Проект";
    case "hackathon":
      return "Хакатон";
  }
}

export function dotPositionPercent(index: number, count: number): number {
  if (count <= 1) return 50;
  const t = index / (count - 1);
  // Keep the circle inside the container at first/last steps
  return 12 + t * 76;
}

export function getSlideClass(direction: 1 | -1, reducedMotion: boolean): string {
  if (reducedMotion) return "";
  return direction > 0 ? "animate-timeline-slide-in-right" : "animate-timeline-slide-in-left";
}

export type TimelineDecadeKey = "2020s" | "2030s";

export function getDecadeKeyFromYear(year: number): TimelineDecadeKey {
  if (year >= 2030) return "2030s";
  return "2020s";
}

export function getDecadeKey(period: string): TimelineDecadeKey {
  return getDecadeKeyFromYear(Number.parseInt(extractYear(period), 10));
}

/** Splits a 4-digit year into `2` + [cat as 0] + `23` parts. */
export function splitYearWithCatSlot(
  year: string
): { prefix: string; suffix: string; decadeKey: TimelineDecadeKey } | null {
  if (!/^\d{4}$/.test(year)) return null;

  return {
    prefix: year.slice(0, 1),
    suffix: year.slice(2),
    decadeKey: getDecadeKeyFromYear(Number.parseInt(year, 10)),
  };
}

/** Shared easing/duration for timeline motion (circle glide, year fade). */
export const timelineMotionClass = "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";
