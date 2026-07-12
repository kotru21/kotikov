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
    case "hackathon":
      return "Хакатон";
  }
}

export function parsePeriodStart(period: string): number {
  const yearMatch = /\d{4}/.exec(period);
  const year = yearMatch !== null ? Number.parseInt(yearMatch[0], 10) : 0;

  const lower = period.toLowerCase();
  const monthPrefixes: Array<[string, number]> = [
    ["январ", 1],
    ["феврал", 2],
    ["март", 3],
    ["апрел", 4],
    ["май", 5],
    ["мая", 5],
    ["июн", 6],
    ["июл", 7],
    ["август", 8],
    ["сентябр", 9],
    ["октябр", 10],
    ["ноябр", 11],
    ["декабр", 12],
  ];

  for (const [prefix, month] of monthPrefixes) {
    if (lower.includes(prefix)) {
      return year * 12 + month;
    }
  }

  return year * 12;
}

/** Newest period first; stable `id` ascending on ties. */
export function sortTimelineItems(items: readonly TimelineItem[]): TimelineItem[] {
  return [...items].sort((a, b) => {
    const byPeriod = parsePeriodStart(b.period) - parsePeriodStart(a.period);
    return byPeriod !== 0 ? byPeriod : a.id - b.id;
  });
}

export type TimelineDecadeKey = "2020s" | "2030s";

export function getDecadeKeyFromYear(year: number): TimelineDecadeKey {
  if (year >= 2030) return "2030s";
  return "2020s";
}

/** Splits a 4-digit year into digit slots with the second digit replaced by a decade cat asset. */
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
