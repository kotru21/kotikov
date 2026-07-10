import { describe, expect, it } from "vitest";

import {
  aboutContent,
  contactsData,
  footerInfo,
  headerContent,
  navigation,
  personData,
  projectsData,
  skillGroups,
  skillsData,
  skillsStackLine,
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

  it("prioritizes contact as the primary recruiter action", () => {
    expect(headerContent.buttons.primary).toEqual({
      text: "Связаться",
      href: "#contacts",
    });
    expect(headerContent.buttons.secondary).toEqual({
      text: "Смотреть проекты",
      href: "#projects",
    });
  });

  it("positions the hero as SOC, not frontend", () => {
    expect(headerContent.eyebrow).toBe("Арсений Котиков · SOC");
    expect(headerContent.title).toBe("Kotikov");
    expect(headerContent.subtitle.toLowerCase()).not.toContain("frontend");
    expect(headerContent.subtitle.length).toBeGreaterThan(40);
  });

  it("surfaces three featured projects with CodeAnalyzer first", () => {
    expect(projectsData).toHaveLength(3);
    expect(projectsData.map((p) => p.slug)).toEqual([
      "code-analyzer",
      "bsuir-iis-api",
      "web-messenger",
    ]);
    for (const p of projectsData) {
      expect(p.title).toBeTruthy();
      expect(p.repoUrl).toMatch(/^https:\/\/github\.com\//);
      expect(p.stack.length).toBeGreaterThan(0);
    }
  });

  it("includes project details for storytelling expand panels", () => {
    for (const project of projectsData) {
      expect(project.details.challenge.length).toBeGreaterThan(10);
      expect(project.details.solution.length).toBeGreaterThan(10);
      expect(project.details.outcome.length).toBeGreaterThan(10);
    }
  });

  it("drops percentage levels from skills and groups them for IB", () => {
    expect(skillsData.every((s) => !("level" in s))).toBe(true);
    expect(skillGroups.map((g) => g.title)).toEqual([
      "Security & DFIR",
      "Offensive / практика",
      "Development",
    ]);
    const skillCategories = new Set(skillsData.map((s) => s.category));
    expect(skillCategories).toEqual(new Set(["security", "offensive", "development"]));
    expect(skillsStackLine).toBe("SOC, AppSec, DFIR, Python, TypeScript");
    expect(skillsStackLine.toLowerCase()).not.toContain("next.js");
  });

  it("defines an about block with three typed principles", () => {
    expect(aboutContent.principles).toHaveLength(3);
    for (const principle of aboutContent.principles) {
      expect(principle.type).toMatch(/^(feat|a11y|perf)$/);
      expect(principle.text.length).toBeGreaterThan(0);
    }
    expect(aboutContent.principles.map((p) => p.type)).toEqual(["feat", "a11y", "perf"]);
    expect(aboutContent.spec.fields.find((f) => f.key === "role")?.value).not.toBe("frontend");
  });

  it("keeps person SEO on SOC / AppSec", () => {
    expect(personData.jobTitle).toBe("SOC / AppSec");
    expect(personData.description.toLowerCase()).not.toMatch(/frontend разработчик/);
    expect(footerInfo.description.toLowerCase()).not.toContain("frontend-разработчик");
  });

  it("orders contacts Email then Telegram then GitHub", () => {
    expect(contactsData.map(({ label }) => label)).toEqual(["Email", "Telegram", "GitHub"]);
  });
});

describe("timeline data", () => {
  it("contains exactly three non-project entries without hackathons", () => {
    expect(timelineData).toHaveLength(3);
    expect(timelineData.every((e) => e.type !== "project")).toBe(true);
    expect(timelineData.every((e) => e.type !== "hackathon")).toBe(true);
    expect(timelineData.map((e) => e.company)).toEqual(["hoster.by", "Innowise", "БГУИР"]);
  });

  it("uses unified period strings", () => {
    expect(timelineData.map((e) => e.period)).toEqual([
      "2026 — н.в.",
      "июн 2025 — ноя 2025",
      "2024 — н.в.",
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

  it("keeps SOC copy careful (no incident narrative keywords)", () => {
    const soc = timelineData.find((e) => e.company === "hoster.by");
    expect(soc).toBeDefined();
    if (soc === undefined) return;
    const text = `${soc.title} ${soc.description}`.toLowerCase();
    expect(text).not.toMatch(/ransomware|anydesk|ioc|payload/);
  });
});
