import { act, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeProvider } from "@/features/theme/client";
import { SiteFrame } from "@/widgets/shell";

type ObserverCallback = IntersectionObserverCallback;

interface MockObserverInstance {
  callback: ObserverCallback;
  options?: IntersectionObserverInit;
  targets: Element[];
}

const observers: MockObserverInstance[] = [];
const observe = vi.fn();
const disconnect = vi.fn();

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly scrollMargin = "0px";
  readonly thresholds = [0];
  readonly unobserve = vi.fn();
  readonly takeRecords = vi.fn((): IntersectionObserverEntry[] => []);
  readonly observe = (target: Element): void => {
    this.targets.push(target);
    observe(target);
  };
  readonly disconnect = (): void => {
    disconnect();
  };

  readonly callback: ObserverCallback;
  readonly options?: IntersectionObserverInit;
  readonly targets: Element[] = [];

  constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
    observers.push(this);
  }
}

function renderSiteFrame(): void {
  render(
    <ThemeProvider>
      <SiteFrame puzzle={<header id="header" />}>
        <main>
          <section id="about" />
          <section id="projects" />
          <section id="skills" />
          <section id="experience" />
          <section id="contacts" />
        </main>
      </SiteFrame>
    </ThemeProvider>
  );
}

function fire(target: Element, intersectionRatio: number, bottom?: number): void {
  const resolvedBottom = bottom ?? (intersectionRatio > 0 ? 400 : -8);
  const isIntersecting = intersectionRatio > 0;
  for (const observer of observers) {
    if (!observer.targets.includes(target)) {
      continue;
    }
    act(() => {
      observer.callback(
        [
          {
            target,
            intersectionRatio,
            isIntersecting,
            boundingClientRect: { bottom: resolvedBottom },
          } as IntersectionObserverEntry,
        ],
        observer as unknown as IntersectionObserver
      );
    });
  }
}

function firePuzzle(intersectionRatio: number, bottom?: number): void {
  const header = document.getElementById("header");
  const puzzle = header?.parentElement;
  if (puzzle === null || puzzle === undefined) {
    throw new Error("Missing puzzle wrapper");
  }
  fire(puzzle, intersectionRatio, bottom);
}

function fireSection(id: string, intersectionRatio: number): void {
  const target = document.getElementById(id);
  if (target === null) {
    throw new Error(`Missing #${id}`);
  }
  fire(target, intersectionRatio);
}

function showChrome(): void {
  firePuzzle(0);
}

function wordCellNames(): string[] {
  return ["Проекты", "Обо мне", "Опыт", "Контакты"];
}

function navByClass(token: string): HTMLElement {
  const nav = screen
    .getAllByRole("navigation", { name: "Основная навигация" })
    .find((el) => classTokens(el).includes(token));
  if (nav === undefined) {
    throw new Error(`Missing chrome nav with ${token}`);
  }
  return nav;
}

function requireSpine(): HTMLElement {
  const spine = document.querySelector("[data-chrome-spine]");
  if (!(spine instanceof HTMLElement)) {
    throw new Error("Missing chrome spine");
  }
  return spine;
}

function classTokens(el: Element): string[] {
  return el.className.split(/\s+/);
}

function stubMatchMedia(reducedMotion = false): void {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reducedMotion && query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("SiteFrame", () => {
  beforeEach(() => {
    observers.length = 0;
    observe.mockClear();
    disconnect.mockClear();
    stubMatchMedia();
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    Object.defineProperty(navigator, "hardwareConcurrency", {
      configurable: true,
      value: 8,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows chrome nav when the puzzle is out of view", () => {
    renderSiteFrame();
    showChrome();

    expect(screen.getAllByRole("navigation", { name: "Основная навигация" }).length).toBe(2);
    expect(screen.getAllByRole("link", { name: "Проекты" })[0]).toHaveAttribute(
      "href",
      "#projects"
    );
    expect(screen.getAllByRole("link", { name: "Обо мне" })[0]).toHaveAttribute("href", "#about");
    expect(screen.getAllByRole("link", { name: "Kotikov" })[0]).toHaveAttribute("href", "#header");
    expect(screen.getAllByRole("link", { name: "Опыт" })[0]).toHaveAttribute("href", "#experience");
    expect(screen.getAllByRole("link", { name: "Контакты" })[0]).toHaveAttribute(
      "href",
      "#contacts"
    );
    expect(screen.getAllByRole("button", { name: /тему/i }).length).toBeGreaterThan(0);
  });

  it("keeps chrome hidden while the puzzle still covers the viewport", () => {
    renderSiteFrame();
    firePuzzle(1);
    expect(
      screen.queryByRole("navigation", { name: "Основная навигация" })
    ).not.toBeInTheDocument();

    firePuzzle(0.8, 720);
    expect(
      screen.queryByRole("navigation", { name: "Основная навигация" })
    ).not.toBeInTheDocument();
  });

  it("shows chrome only after the puzzle bottom leaves the viewport", () => {
    renderSiteFrame();
    firePuzzle(0.2, -1);

    expect(screen.getAllByRole("navigation", { name: "Основная навигация" }).length).toBe(2);
  });

  it("fills the matching word cell, sets aria-current, and never the home cell", () => {
    renderSiteFrame();
    showChrome();
    fireSection("projects", 0.9);

    for (const link of screen.getAllByRole("link", { name: "Проекты" })) {
      expect(classTokens(link)).toContain("bg-primary-500");
      expect(link).toHaveAttribute("aria-current", "location");
    }
    for (const link of screen.getAllByRole("link", { name: "Kotikov" })) {
      expect(classTokens(link)).not.toContain("bg-primary-500");
      expect(link).not.toHaveAttribute("aria-current");
    }
  });

  it("rotates the mobile spine title as a sideways line", () => {
    renderSiteFrame();
    showChrome();
    fireSection("projects", 0.9);

    const spine = requireSpine();
    expect(spine.tagName).toBe("P");
    expect(spine).toHaveAttribute("aria-hidden", "true");
    expect(spine).toHaveTextContent("Избранные работы");
    expect(classTokens(spine)).toEqual(
      expect.arrayContaining([
        "overflow-hidden",
        "whitespace-nowrap",
        "tracking-[0.24em]",
        "[writing-mode:vertical-rl]",
        "rotate-180",
      ])
    );
    expect(classTokens(spine)).not.toContain("tracking-[-0.05em]");
    expect(classTokens(spine)).not.toContain("[text-orientation:upright]");
    expect(classTokens(spine.parentElement!)).toEqual(
      expect.arrayContaining(["w-10", "h-full", "overflow-hidden", "translate-x-0"])
    );
  });

  it("does not highlight a word cell while Skills is active", () => {
    renderSiteFrame();
    showChrome();
    fireSection("skills", 1);

    expect(document.querySelector("[data-chrome-spine]")).toHaveTextContent("Мои навыки");
    for (const name of wordCellNames()) {
      for (const link of screen.getAllByRole("link", { name })) {
        expect(classTokens(link)).not.toContain("bg-primary-500");
        expect(classTokens(link)).toContain("dark:bg-background-dark");
        expect(link).not.toHaveAttribute("aria-current");
      }
    }
  });

  it("offsets rails on small screens and keeps chrome clearance outside section borders", () => {
    renderSiteFrame();
    const offset = document.querySelector(".max-md\\:pl-10.max-md\\:pr-20");
    expect(offset).not.toBeNull();
    expect(offset?.className.split(/\s+/)).toEqual(
      expect.arrayContaining(["max-md:pl-10", "max-md:pr-20", "md:pb-14"])
    );
    expect(offset?.className).not.toContain("[&>main>*]:pb-14");
    expect(offset?.className).not.toContain("[&>footer]:pb-14");
    expect(offset?.querySelector("main")).not.toBeNull();
    expect(document.getElementById("projects")?.className).not.toMatch(/\bpb-14\b/);
    expect(offset?.className).not.toContain("border-2");
  });

  it("keeps one outer chrome stroke and a single divide between cells", () => {
    renderSiteFrame();
    showChrome();

    const desktop = navByClass("grid-cols-5");
    expect(classTokens(desktop)).toEqual(
      expect.arrayContaining(["border-2", "divide-x-2", "h-14", "grid-cols-5"])
    );
    expect(within(desktop).getByRole("link", { name: "Обо мне" })).not.toHaveClass("border-2");
    const desktopHome = within(desktop).getByRole("link", { name: "Kotikov" }).parentElement;
    expect(desktopHome).not.toBeNull();
    expect(desktopHome).not.toHaveClass("border-2");

    const mobile = navByClass("grid-rows-5");
    expect(classTokens(mobile)).toEqual(
      expect.arrayContaining(["border-2", "divide-y-2", "w-20", "grid-rows-5"])
    );
    expect(within(mobile).getByRole("link", { name: "Обо мне" })).not.toHaveClass("border-2");
    const mobileHome = within(mobile).getByRole("link", { name: "Kotikov" }).parentElement;
    expect(mobileHome).not.toBeNull();
    expect(mobileHome).not.toHaveClass("border-2");
  });

  it("keeps the stacked home mark and theme toggle as a padded group", () => {
    renderSiteFrame();
    showChrome();

    const mobileNav = navByClass("grid-rows-5");
    const homeLink = within(mobileNav).getByRole("link", { name: "Kotikov" });
    const homeTokens = classTokens(homeLink);
    expect(homeTokens).toEqual(expect.arrayContaining(["min-h-11", "min-w-11"]));
    expect(homeTokens).not.toContain("flex-1");
    expect(homeTokens).not.toContain("w-full");

    const homeCell = homeLink.parentElement;
    expect(homeCell).not.toBeNull();
    expect(classTokens(homeCell!)).toEqual(
      expect.arrayContaining(["flex-col", "gap-2", "p-2", "justify-center"])
    );

    const themeToggle = within(homeCell!).getByRole("button", { name: /тему/i });
    expect(classTokens(themeToggle)).toContain("size-11");
  });

  it("wraps stacked rail labels inside w-20 instead of giant type", () => {
    renderSiteFrame();
    showChrome();

    const mobileNav = navByClass("grid-rows-5");
    expect(classTokens(mobileNav)).toEqual(expect.arrayContaining(["w-20", "grid-rows-5"]));

    const about = within(mobileNav).getByRole("link", { name: "Обо мне" });
    expect(classTokens(about)).toEqual(
      expect.arrayContaining(["flex-col", "break-words", "whitespace-normal", "text-[0.65rem]"])
    );
    expect(about.className).not.toMatch(/clamp/);
  });

  it("scales desktop bar labels to the cell instead of clipping giant type", () => {
    renderSiteFrame();
    showChrome();

    const desktop = navByClass("grid-cols-5");
    const contacts = within(desktop).getByRole("link", { name: "Контакты" });
    expect(classTokens(contacts)).toEqual(
      expect.arrayContaining(["@container", "min-h-11", "min-w-0"])
    );
    expect(contacts.className).not.toMatch(/overflow-hidden/);

    const label = contacts.querySelector("span");
    expect(label).not.toBeNull();
    expect(classTokens(label!)).toEqual(
      expect.arrayContaining([
        "px-1.5",
        "leading-none",
        "whitespace-nowrap",
        "font-black",
        "uppercase",
        "tracking-[-0.05em]",
        "text-[clamp(1.35rem,17cqi,2.5rem)]",
      ])
    );
    expect(label!.className).not.toMatch(/clamp\(1\.5rem,4vw,2\.75rem\)/);
  });

  it("slides chrome in from the edges instead of popping on", () => {
    renderSiteFrame();
    showChrome();
    fireSection("projects", 0.9);

    const mobile = navByClass("grid-rows-5");
    expect(classTokens(mobile)).toEqual(
      expect.arrayContaining([
        "translate-x-0",
        "motion-safe:transition-transform",
        "motion-safe:duration-300",
        "motion-safe:ease-out",
      ])
    );
    const desktop = navByClass("grid-cols-5");
    expect(classTokens(desktop)).toEqual(
      expect.arrayContaining(["translate-y-0", "motion-safe:ease-out"])
    );
    const spineBar = document.querySelector("[data-chrome-spine]")?.parentElement;
    expect(classTokens(spineBar!)).toEqual(
      expect.arrayContaining(["translate-x-0", "motion-safe:ease-out"])
    );
    expect(classTokens(spineBar!)).not.toContain("-translate-x-full");
  });

  it("slides chrome back out when returning to the puzzle", () => {
    renderSiteFrame();
    showChrome();
    fireSection("projects", 0.9);
    firePuzzle(1);

    expect(
      screen.queryByRole("navigation", { name: "Основная навигация" })
    ).not.toBeInTheDocument();

    const mobile = document.querySelector("nav.grid-rows-5");
    const desktop = document.querySelector("nav.grid-cols-5");
    expect(mobile).not.toBeNull();
    expect(desktop).not.toBeNull();
    expect(classTokens(mobile!)).toEqual(
      expect.arrayContaining(["translate-x-full", "motion-safe:ease-in"])
    );
    expect(classTokens(desktop!)).toEqual(
      expect.arrayContaining(["translate-y-full", "motion-safe:ease-in"])
    );

    const spineBar = document.querySelector("[data-chrome-spine]")?.parentElement;
    expect(classTokens(spineBar!)).toEqual(
      expect.arrayContaining(["-translate-x-full", "motion-safe:ease-in"])
    );
  });

  it("skips the chrome slide when reduced motion is preferred", () => {
    stubMatchMedia(true);
    renderSiteFrame();
    showChrome();

    const mobile = navByClass("grid-rows-5");
    expect(classTokens(mobile)).toEqual(
      expect.arrayContaining(["transition-none", "translate-x-0"])
    );
    expect(classTokens(mobile)).not.toContain("motion-safe:transition-transform");

    const desktop = navByClass("grid-cols-5");
    expect(classTokens(desktop)).toEqual(
      expect.arrayContaining(["transition-none", "translate-y-0"])
    );
  });
});
