import { act, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SkillsWidget } from "@/widgets/skills";
import { SkillsDesktopView, SkillsMobileView } from "@/widgets/skills/ui";

const performanceSettings = {
  reducedMotion: true,
  lowPerformance: false,
};

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({
    reducedMotion: performanceSettings.reducedMotion,
    lowPerformance: performanceSettings.lowPerformance,
  }),
  useSceneMotionPolicy: () => ({
    canRunContinuous: false,
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

function requireElement(element: HTMLElement | null, selector: string): HTMLElement {
  if (element === null) throw new Error(`Expected ${selector} to be rendered`);
  return element;
}

function stubMatchMedia(isMobile: boolean): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("max-width") ? isMobile : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
}

describe("SkillsWidget responsive rendering", () => {
  beforeEach(() => {
    performanceSettings.reducedMotion = true;
    performanceSettings.lowPerformance = false;
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    vi.stubGlobal("requestAnimationFrame", () => 0);
    vi.stubGlobal("cancelAnimationFrame", () => undefined);
    stubMatchMedia(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps CSS shells and mounts the desktop tree after matchMedia sync", async () => {
    stubMatchMedia(false);
    const { container } = render(<SkillsWidget />);

    await act(async () => {
      await Promise.resolve();
    });

    const mobileView = requireElement(
      container.querySelector<HTMLElement>('[data-skills-view="mobile"]'),
      "mobile Skills view"
    );
    const desktopView = requireElement(
      container.querySelector<HTMLElement>('[data-skills-view="desktop"]'),
      "desktop Skills view"
    );

    expect(container.querySelectorAll("#skills")).toHaveLength(1);
    expect(mobileView).toHaveClass("md:hidden");
    expect(desktopView).toHaveClass("hidden", "md:block");
    expect(mobileView.querySelector('[aria-labelledby="skills-heading-mobile"]')).toBeNull();
    expect(
      desktopView.querySelector('[aria-labelledby="skills-heading-desktop"]')
    ).toBeTruthy();

    const desktopHeading = within(desktopView).getByRole("heading", {
      name: "Мои навыки",
      hidden: true,
    });
    expect(desktopHeading).toHaveAttribute("id", "skills-heading-desktop");
  });

  it("mounts the mobile tree after matchMedia sync on small viewports", async () => {
    stubMatchMedia(true);
    const { container } = render(<SkillsWidget />);

    await act(async () => {
      await Promise.resolve();
    });

    const mobileView = requireElement(
      container.querySelector<HTMLElement>('[data-skills-view="mobile"]'),
      "mobile Skills view"
    );
    const desktopView = requireElement(
      container.querySelector<HTMLElement>('[data-skills-view="desktop"]'),
      "desktop Skills view"
    );

    expect(mobileView.querySelector('[aria-labelledby="skills-heading-mobile"]')).toBeTruthy();
    expect(desktopView.querySelector('[aria-labelledby="skills-heading-desktop"]')).toBeNull();
  });
});

describe("Skills reduced-motion gating", () => {
  beforeEach(() => {
    performanceSettings.reducedMotion = true;
    performanceSettings.lowPerformance = false;
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    vi.stubGlobal("requestAnimationFrame", () => 0);
    vi.stubGlobal("cancelAnimationFrame", () => undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders grouped tags without marquee tracks or cursor under reduced motion", () => {
    const { container: desktopRoot } = render(
      <SkillsDesktopView headingId="skills-heading-desktop" />
    );
    expect(screen.getByRole("heading", { name: "Мои навыки" })).toBeInTheDocument();
    expect(screen.getAllByRole("list").length).toBeGreaterThan(0);
    expect(desktopRoot.querySelector('[data-testid="skill-marquee-track"]')).toBeNull();
    expect(desktopRoot.querySelector('img[src="/nyancat.svg"]')).toBeNull();

    const { container: mobileRoot, unmount } = render(
      <SkillsMobileView headingId="skills-heading-mobile" />
    );
    expect(mobileRoot.querySelector('[data-testid="skill-marquee-track"]')).toBeNull();
    expect(within(mobileRoot).getAllByRole("list").length).toBeGreaterThan(0);
    unmount();
  });
});
