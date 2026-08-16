import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { skillsData } from "@/shared/config/content";
import { SkillsWidget } from "@/widgets/skills";
import { SkillsInteractionProvider } from "@/widgets/skills/model/SkillsInteractionContext";
import SkillsCursorNyancat from "@/widgets/skills/ui/SkillsCursorNyancat";

vi.mock("next/image", async () => {
  const { MockNextImage } = await import("../helpers/mockNextImage");
  return { default: MockNextImage };
});

const performanceSettings = {
  reducedMotion: false,
  lowPerformance: false,
};

vi.mock("@/features/performance/client", () => ({
  usePerformanceSettings: () => ({
    reducedMotion: performanceSettings.reducedMotion,
    lowPerformance: performanceSettings.lowPerformance,
  }),
  useSceneMotionPolicy: () => ({
    canRunContinuous: true,
    isInView: true,
    reducedMotion: performanceSettings.reducedMotion,
    lowPerformance: performanceSettings.lowPerformance,
    isDocumentVisible: true,
    dominantEffect: "marquee",
  }),
  useRafWhile: (active: boolean, onFrame: (time: number) => void) => {
    if (!active) return;
    onFrame(0);
    onFrame(100);
    onFrame(600);
  },
}));

class IntersectionObserverMock {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];
  callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  readonly disconnect = vi.fn();
  readonly observe = vi.fn((target: Element) => {
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  });
  readonly takeRecords = vi.fn((): IntersectionObserverEntry[] => []);
  readonly unobserve = vi.fn();
}

describe("Skills coverage gaps", () => {
  beforeEach(() => {
    performanceSettings.reducedMotion = false;
    performanceSettings.lowPerformance = false;
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(16);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("animates SkillsCursorNyancat after pointer entry and movement", () => {
    const container = document.createElement("section");
    Object.defineProperty(container, "getBoundingClientRect", {
      value: () => ({
        left: 0,
        top: 0,
        right: 400,
        bottom: 300,
        width: 400,
        height: 300,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    });
    document.body.appendChild(container);
    const ref = { current: container };

    const { container: root } = render(
      <SkillsInteractionProvider>
        <SkillsCursorNyancat containerRef={ref} isMotionActive />
      </SkillsInteractionProvider>
    );

    act(() => {
      container.dispatchEvent(new Event("mouseenter"));
      container.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 200, clientY: 150, bubbles: true })
      );
    });

    expect(root.querySelector("img")).toBeTruthy();
    container.remove();
  });

  it("renders a skills ticker and group cells when motion is allowed", () => {
    render(<SkillsWidget />);

    expect(screen.getByRole("heading", { name: "Мои навыки" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Security & DFIR" })).toBeInTheDocument();
    expect(screen.getAllByText(skillsData[0].name).length).toBeGreaterThan(0);
    expect(document.querySelectorAll("[data-ticker-mark='k']").length).toBeGreaterThan(0);
    expect(document.querySelector("[data-marquee='on']")).not.toBeNull();
  });

  it("does not mount cursor nyancat when reduced motion is on", () => {
    performanceSettings.reducedMotion = true;
    const { container } = render(<SkillsWidget />);
    expect(container.querySelector('img[src="/nyancat.svg"]')).toBeNull();
    expect(container.querySelector("[data-marquee='on']")).toBeNull();
  });
});
