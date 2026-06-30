import { describe, expect, it } from "vitest";

import {
  aboutContent,
  navigation,
  projectsData,
  skillGroups,
  skillsData,
  timelineData,
} from "@/shared/config/content";

describe("content model", () => {
  it("exposes the polished navigation anchors", () => {
    expect(navigation.map((n) => n.href)).toEqual([
      "#header",
      "#about",
      "#projects",
      "#skills",
      "#experience",
      "#contacts",
    ]);
  });

  it("has no placeholder nav labels", () => {
    expect(navigation.some((n) => n.name === "Туда")).toBe(false);
  });

  it("surfaces three featured projects with required fields", () => {
    expect(projectsData).toHaveLength(3);
    for (const p of projectsData) {
      expect(p.title).toBeTruthy();
      expect(p.repoUrl).toMatch(/^https:\/\/github\.com\//);
      expect(p.stack.length).toBeGreaterThan(0);
    }
  });

  it("drops percentage levels from skills and groups them", () => {
    expect(skillsData.every((s) => !("level" in s))).toBe(true);
    expect(skillGroups.map((g) => g.title)).toEqual(["Frontend", "Backend", "Инструменты"]);
  });

  it("defines an about block with three principles", () => {
    expect(aboutContent.principles).toHaveLength(3);
  });
});

describe("timeline data", () => {
  it("contains exactly four non-project entries in chronological order", () => {
    expect(timelineData).toHaveLength(4);
    expect(timelineData.map((e) => e.id)).toEqual([1, 2, 4, 7]);
    expect(timelineData.every((e) => e.type !== "project")).toBe(true);
  });

  it("uses unified period strings", () => {
    expect(timelineData.map((e) => e.period)).toEqual([
      "2023",
      "2024 — н.в.",
      "июн 2025 — ноя 2025",
      "2026",
    ]);
  });

  it("has required fields on every entry", () => {
    for (const entry of timelineData) {
      expect(entry.title).toBeTruthy();
      expect(entry.company).toBeTruthy();
      expect(entry.description).toBeTruthy();
      expect(entry.technologies.length).toBeGreaterThanOrEqual(1);
    }
  });
});
