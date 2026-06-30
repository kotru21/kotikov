import { describe, expect, it } from "vitest";

import {
  aboutContent,
  navigation,
  projectsData,
  skillGroups,
  skillsData,
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
