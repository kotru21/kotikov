import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SkillsWidget } from "@/widgets/skills";

vi.mock("@/features/device", () => ({
  useIsMobile: () => false,
}));

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({ reducedMotion: true, lowPerformance: false }),
  useSceneMotionPolicy: () => ({ canRunContinuous: false }),
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

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
vi.stubGlobal("requestAnimationFrame", () => 0);
vi.stubGlobal("cancelAnimationFrame", () => undefined);

function requireElement(element: HTMLElement | null, selector: string): HTMLElement {
  if (element === null) throw new Error(`Expected ${selector} to be rendered`);
  return element;
}

describe("SkillsWidget responsive rendering", () => {
  it("renders one section with both uniquely labelled CSS responsive views", () => {
    const { container } = render(<SkillsWidget />);
    const mobileView = requireElement(
      container.querySelector<HTMLElement>('[data-skills-view="mobile"]'),
      "mobile Skills view"
    );
    const desktopView = requireElement(
      container.querySelector<HTMLElement>('[data-skills-view="desktop"]'),
      "desktop Skills view"
    );

    expect(container.querySelectorAll("#skills")).toHaveLength(1);
    expect(container.querySelector("#skills > div")).toHaveClass("w-full", "max-w-none");
    expect(container.querySelector("#skills > div")).not.toHaveClass("px-6");
    expect(mobileView).toHaveClass("md:hidden");
    expect(desktopView).toHaveClass("hidden", "md:block");

    expect(screen.getAllByRole("heading", { name: "Мои навыки", hidden: true })).toHaveLength(2);

    const mobileHeading = within(mobileView).getByRole("heading", {
      name: "Мои навыки",
      hidden: true,
    });
    const desktopHeading = within(desktopView).getByRole("heading", {
      name: "Мои навыки",
      hidden: true,
    });

    expect(mobileHeading).toHaveAttribute("id", "skills-heading-mobile");
    expect(desktopHeading).toHaveAttribute("id", "skills-heading-desktop");
    expect(mobileHeading.id).not.toBe(desktopHeading.id);
    expect(mobileView.querySelector('[aria-labelledby="skills-heading-mobile"]')).toContainElement(
      mobileHeading
    );
    expect(
      desktopView.querySelector('[aria-labelledby="skills-heading-desktop"]')
    ).toContainElement(desktopHeading);
  });
});
