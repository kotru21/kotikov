import { describe, expect, it } from "vitest";

import type { TimelineItem } from "@/entities/timeline";
import {
  extractYear,
  getTypeLabel,
  parsePeriodStart,
  sortTimelineItems,
  splitYearWithCatSlot,
} from "@/widgets/timeline/ui";

describe("timelineUtils", () => {
  it("extractYear returns the first 4-digit year from a period", () => {
    expect(extractYear("2023")).toBe("2023");
    expect(extractYear("2024 — н.в.")).toBe("2024");
    expect(extractYear("июн 2025 — ноя 2025")).toBe("2025");
  });

  it("parsePeriodStart sorts months within the same year", () => {
    expect(parsePeriodStart("2025")).toBe(2025 * 12);
    expect(parsePeriodStart("июн 2025 — ноя 2025")).toBe(2025 * 12 + 6);
    expect(parsePeriodStart("2025")).toBeLessThan(parsePeriodStart("июн 2025 — ноя 2025"));
  });

  it("getTypeLabel returns Russian labels for each type", () => {
    expect(getTypeLabel("work")).toBe("Работа");
    expect(getTypeLabel("education")).toBe("Обучение");
    expect(getTypeLabel("hackathon")).toBe("Хакатон");
  });

  it("splitYearWithCatSlot maps decade keys and rejects non-years", () => {
    expect(splitYearWithCatSlot("2024")).toEqual({
      prefix: "2",
      suffix: "24",
      decadeKey: "2020s",
    });
    expect(splitYearWithCatSlot("2031")).toEqual({
      prefix: "2",
      suffix: "31",
      decadeKey: "2030s",
    });
    expect(splitYearWithCatSlot("н.в.")).toBeNull();
  });

  it("sortTimelineItems orders newest first and breaks ties by id ascending", () => {
    const items: TimelineItem[] = [
      {
        id: 2,
        title: "B",
        company: "c",
        period: "2026",
        description: "d",
        technologies: [],
        type: "hackathon",
      },
      {
        id: 1,
        title: "A",
        company: "c",
        period: "2026",
        description: "d",
        technologies: [],
        type: "work",
      },
      {
        id: 3,
        title: "C",
        company: "c",
        period: "июн 2025 — ноя 2025",
        description: "d",
        technologies: [],
        type: "work",
      },
    ];

    expect(sortTimelineItems(items).map((item) => item.id)).toEqual([1, 2, 3]);
  });
});
