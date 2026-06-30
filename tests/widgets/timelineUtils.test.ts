import { describe, expect, it } from "vitest";

import { extractYear, parsePeriodStart } from "@/widgets/timeline/ui/timelineUtils";

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
});
