import { describe, expect, it } from "vitest";

import {
  aboutContent,
  chromeNavItems,
  contactsData,
  footerInfo,
  headerContent,
  navigation,
  personData,
  projectsData,
  projectsSection,
  puzzleCells,
  puzzleTickers,
  sectionTitles,
  skillGroups,
  skillsData,
  skillsStackLine,
  timelineData,
} from "@/shared/config/content";

function aboutField(key: string): string | undefined {
  return aboutContent.spec.fields.find((f) => f.key === key)?.value;
}

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
    expect(navigation.map((n) => n.name)).not.toContain("Туда");
  });

  it("exposes puzzle cells in desktop tab order", () => {
    expect(puzzleCells.map((c) => c.id)).toEqual(["about", "contacts", "projects", "experience"]);
    expect(puzzleCells.map((c) => c.href)).toEqual([
      "#about",
      "#contacts",
      "#projects",
      "#experience",
    ]);
    expect(puzzleCells.map((c) => c.area)).toEqual(["about", "contacts", "projects", "experience"]);
  });

  it("puts skills only on the puzzle bottom ticker, not in chrome cells", () => {
    expect(chromeNavItems.map((i) => i.id)).toEqual([
      "about",
      "projects",
      "home",
      "experience",
      "contacts",
    ]);
    expect(puzzleTickers.bottom).toContain("OWASP / SAST");
    expect(puzzleTickers.bottom).toContain(" × ");
  });

  it("keeps section titles for the mobile top chrome strip", () => {
    expect(sectionTitles.about).toBe("Коротко обо мне");
    expect(sectionTitles.projects).toBe("Избранные работы");
    expect(sectionTitles.skills).toBe("Мои навыки");
    expect(sectionTitles.experience).toBe("Мой путь");
    expect(sectionTitles.contacts).toBe("Напишите мне");
  });

  it("positions the hero as SOC, not frontend", () => {
    expect(headerContent.eyebrow).toBe("Арсений Котиков · SOC");
    expect(headerContent.title).toBe("Kotikov");
    expect(headerContent.subtitle.toLowerCase()).not.toContain("frontend");
    expect(headerContent.subtitle.length).toBeGreaterThan(40);
  });

  it("surfaces featured projects with evtxview first", () => {
    expect(projectsData).toHaveLength(4);
    expect(projectsSection).toEqual({
      eyebrow: "Проекты",
      title: "Избранные работы",
      description:
        "Несколько проектов, которые показывают, как я думаю о продукте, интерфейсе и реализации.",
    });
    expect(projectsData.map((p) => p.slug)).toEqual([
      "evtx-viewer",
      "code-analyzer",
      "bsuir-iis-api",
      "web-messenger",
    ]);
    for (const p of projectsData) {
      expect(p.title).toBeTruthy();
      expect(p.summary.length).toBeGreaterThan(20);
      expect(p.repoUrl).toMatch(/^https:\/\/github\.com\//);
      expect(p.cardMeta).toBeTruthy();
      expect(p.accentColor).toMatch(/^#/);
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

  it("defines an about block with three plain InfoSec principles", () => {
    expect(aboutContent.principles).toHaveLength(3);
    for (const principle of aboutContent.principles) {
      expect(typeof principle).toBe("string");
      expect(principle.length).toBeGreaterThan(0);
      expect(principle).not.toMatch(/^(feat|a11y|perf):/);
      expect(principle).not.toMatch(/^>/);
    }
    expect(aboutContent.principles.some((p) => /SOC/i.test(p))).toBe(true);
    expect(aboutContent.principles.some((p) => /AppSec/i.test(p))).toBe(true);
    expect(aboutField("role")).not.toBe("frontend");
  });

  it("derives about spec identity fields from personData", () => {
    expect(aboutField("name")).toBe(personData.nameRu);
    expect(aboutField("handle")).toBe(personData.nickname);
    expect(aboutField("role")).toBe(personData.jobTitle);
  });

  it("keeps person SEO on SOC / AppSec", () => {
    expect(personData.jobTitle).toBe("SOC / AppSec");
    expect(personData.description.toLowerCase()).not.toMatch(/frontend разработчик/);
    expect(footerInfo.description.toLowerCase()).not.toContain("frontend-разработчик");
  });

  it("orders contacts Email then Telegram then GitHub then Habr", () => {
    expect(contactsData.map(({ label }) => label)).toEqual([
      "Email",
      "Telegram",
      "GitHub",
      "Habr",
    ]);
  });
});

describe("timeline data", () => {
  it("contains work, education, and IB-framed hackathons without projects", () => {
    expect(timelineData).toHaveLength(5);
    const allowedTimelineTypes = new Set(["work", "education", "hackathon"]);
    expect(timelineData.every((e) => allowedTimelineTypes.has(e.type))).toBe(true);
    expect(timelineData.filter((e) => e.type === "hackathon").map((e) => e.company)).toEqual([
      "MTS",
      "ByChange",
    ]);
    expect(timelineData.map((e) => e.company)).toEqual([
      "hoster.by",
      "MTS",
      "Innowise",
      "БГУИР",
      "ByChange",
    ]);
  });

  it("frames hackathons through security concerns", () => {
    const hackathons = timelineData.filter((e) => e.type === "hackathon");
    expect(hackathons).toHaveLength(2);
    for (const entry of hackathons) {
      const text = `${entry.description} ${entry.technologies.join(" ")}`.toLowerCase();
      expect(text).toMatch(/auth|access|privacy|iam|security|довер|защит|доступ|данн/);
    }
  });

  it("uses unified period strings", () => {
    expect(timelineData.map((e) => e.period)).toEqual([
      "2026 — н.в.",
      "2026",
      "июн 2025 — ноя 2025",
      "2024 — н.в.",
      "2023",
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
