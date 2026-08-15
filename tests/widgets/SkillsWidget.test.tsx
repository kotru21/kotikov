import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sectionTitles, skillGroups, skillsData } from "@/shared/config/content";
import { SkillsWidget } from "@/widgets/skills";

const performanceSettings = {
  reducedMotion: false,
  lowPerformance: false,
};

vi.mock("next/image", async () => {
  const { MockNextImage } = await import("../helpers/mockNextImage");
  return { default: MockNextImage };
});

vi.mock("@/features/performance/client", () => ({
  usePerformanceSettings: () => ({
    reducedMotion: performanceSettings.reducedMotion,
    lowPerformance: performanceSettings.lowPerformance,
  }),
  useSceneMotionPolicy: () => ({
    canRunContinuous: !performanceSettings.reducedMotion && !performanceSettings.lowPerformance,
    isInView: true,
    reducedMotion: performanceSettings.reducedMotion,
    lowPerformance: performanceSettings.lowPerformance,
    isDocumentVisible: true,
    dominantEffect: "marquee",
  }),
  useRafWhile: () => undefined,
}));

class IntersectionObserverMock {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];
  readonly disconnect = vi.fn();
  readonly observe = vi.fn();
  readonly takeRecords = vi.fn((): IntersectionObserverEntry[] => []);
  readonly unobserve = vi.fn();
}

function requireSkillsSection(container: HTMLElement): HTMLElement {
  const section = container.querySelector<HTMLElement>("#skills");
  if (section === null) {
    throw new Error("Expected #skills to be rendered");
  }
  return section;
}

describe("SkillsWidget", () => {
  beforeEach(() => {
    performanceSettings.reducedMotion = false;
    performanceSettings.lowPerformance = false;
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders group cells and nyancat inside #skills without a puzzle header", async () => {
    const { container } = render(<SkillsWidget />);
    const skills = requireSkillsSection(container);
    expect(skills).not.toHaveClass("border-2");
    expect(document.querySelector("#header")).toBeNull();
    expect(await screen.findByTestId("skills-nyancat")).toBeInTheDocument();

    const heading = within(skills).getByRole("heading", {
      level: 2,
      name: sectionTitles.skills,
    });
    expect(heading).toHaveAttribute("id", "skills-heading");
    expect(heading).toHaveClass("sr-only", "md:not-sr-only");
    expect(skills.querySelector(".relative.overflow-hidden")).not.toBeNull();

    expect(within(skills).getAllByText(skillsData[0].name).length).toBeGreaterThan(0);
    const ticker = skills.querySelector("[data-ticker-orientation='horizontal']");
    expect(ticker).toHaveClass("border-0");
    expect(ticker).not.toHaveClass("border-2");
    expect(skills.querySelectorAll("[data-ticker-mark='k']").length).toBeGreaterThan(0);

    for (const group of skillGroups) {
      expect(within(skills).getByRole("heading", { name: group.title })).toBeInTheDocument();
    }
    const groups = within(skills).getAllByRole("article");
    expect(groups).toHaveLength(skillGroups.length);
    expect(groups.every((group) => group.hasAttribute("data-nyancat-perch"))).toBe(true);
    expect(groups.every((group) => group.className.includes("border-0"))).toBe(true);
    expect(groups.every((group) => !group.className.includes("border-2"))).toBe(true);
    expect(groups[0].parentElement?.className).toMatch(/border-t-2/);
    expect(groups[0].parentElement?.className).not.toMatch(/divide-/);
    expect(groups[0].querySelector("li")?.className).toContain("border-2");
    expect(skills.querySelector("[data-nyancat-perch] [data-ticker-orientation]")).not.toBeNull();
    expect(groups[0].className).toMatch(/bg-background-primary/);
    expect(groups[1]).toHaveClass("bg-primary-500", "text-[#111]");
    expect(groups[2].className).toMatch(/bg-background-primary/);
    expect(within(skills).getByRole("heading", { name: "Security & DFIR" })).toBeInTheDocument();
  });

  it("does not use teal as small text on paper", () => {
    const { container } = render(<SkillsWidget />);
    const skills = requireSkillsSection(container);

    expect(screen.queryAllByText("Навыки")).toHaveLength(0);
    expect(skills.querySelector("[class*='text-primary']")).toBeNull();
  });

  it("keeps groups and a static ticker when motion is reduced", () => {
    performanceSettings.reducedMotion = true;
    const { container } = render(<SkillsWidget />);
    const skills = requireSkillsSection(container);

    expect(within(skills).getByRole("heading", { name: "Security & DFIR" })).toBeInTheDocument();
    expect(skills.querySelector('img[src="/nyancat.svg"]')).toBeNull();
    expect(skills.querySelector("[data-marquee='on']")).toBeNull();
    const ticker = skills.querySelector("[data-ticker-orientation='horizontal']");
    expect(ticker?.textContent).toContain("OWASP / SAST");
    expect(ticker).toHaveClass("border-0");
    expect(ticker).not.toHaveClass("border-2");
    expect(ticker?.querySelector("[data-ticker-mark='k']")).not.toBeNull();
  });
});
