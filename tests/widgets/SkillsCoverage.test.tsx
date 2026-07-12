import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { skillsData } from "@/shared/config/content";
import { SkillsInteractionProvider } from "@/widgets/skills/model/SkillsInteractionContext";
import {
  SkillMarqueeCard,
  SkillMarqueeRow,
  SkillsDesktopView,
  SkillsMobileView,
} from "@/widgets/skills/ui";
import SkillsCursorNyancat from "@/widgets/skills/ui/SkillsCursorNyancat";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { alt = "", ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element -- test stub
    return <img alt={String(alt)} {...rest} />;
  },
}));

const performanceSettings = {
  reducedMotion: false,
  lowPerformance: false,
};

vi.mock("@/features/performance", () => ({
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

  it("renders SkillMarqueeCard without provider and with provider toggle", () => {
    const { unmount } = render(<SkillMarqueeCard skill={skillsData[0]} />);
    const card = screen.getByText(skillsData[0].name).closest("[aria-hidden='true']");
    expect(card).toBeTruthy();
    if (!(card instanceof HTMLElement)) throw new Error("expected skill card element");
    fireEvent.mouseEnter(card);
    fireEvent.mouseLeave(card);
    unmount();

    render(
      <SkillsInteractionProvider>
        <SkillMarqueeCard skill={skillsData[0]} />
      </SkillsInteractionProvider>
    );
    const interactive = screen.getByText(skillsData[0].name).closest("[aria-hidden='true']");
    if (!(interactive instanceof HTMLElement)) throw new Error("expected skill card element");
    fireEvent.mouseEnter(interactive);
    fireEvent.mouseLeave(interactive);
  });

  it("runs curved marquee arc updates while motion is active", () => {
    render(<SkillMarqueeRow skills={skillsData.slice(0, 2)} curved isMotionActive />);

    expect(screen.getByTestId("skill-marquee-track")).toHaveAttribute("data-motion-active", "true");
  });

  it("renders flat marquee track when not curved", () => {
    render(<SkillMarqueeRow skills={skillsData.slice(0, 1)} isMotionActive={false} />);

    expect(screen.getByTestId("skill-marquee-track")).toHaveStyle({
      animationPlayState: "paused",
    });
  });

  it("uses four copies of the base skills list for seamless -25% loops", () => {
    render(<SkillMarqueeRow skills={skillsData.slice(0, 2)} curved isMotionActive />);
    const cards = screen.getAllByText(skillsData[0].name);
    expect(cards).toHaveLength(4);
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

  it("renders desktop and mobile skills views with marquee when motion allowed", () => {
    const { rerender } = render(<SkillsDesktopView headingId="skills-heading-desktop" />);
    const desktopGroup = screen.getByRole("group", { name: "Мои навыки" });
    expect(desktopGroup).toBeInTheDocument();
    expect(screen.getByText("SOC, AppSec, DFIR, Python, TypeScript")).toBeInTheDocument();

    const track = screen.getByTestId("skill-marquee-track");
    expect(track).toHaveAttribute("data-motion-active", "true");
    expect(track).toHaveStyle({ animationPlayState: "running" });
    expect(track).toHaveStyle({ animationDuration: "30s" });

    fireEvent.pointerEnter(desktopGroup);
    expect(track).toHaveAttribute("data-motion-active", "true");

    fireEvent.pointerLeave(desktopGroup);
    expect(track).toHaveAttribute("data-motion-active", "true");

    rerender(<SkillsMobileView headingId="skills-heading-mobile" />);
    expect(screen.getByRole("heading", { name: "Мои навыки" })).toBeInTheDocument();
    expect(screen.getByText("SOC, AppSec, DFIR, Python, TypeScript")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /LinkedIn/i })).toBeInTheDocument();
  });

  it("does not mount cursor nyancat when reduced motion is on", () => {
    performanceSettings.reducedMotion = true;
    const { container } = render(<SkillsDesktopView headingId="skills-heading-desktop" />);
    expect(container.querySelector('img[src="/nyancat.svg"]')).toBeNull();
    expect(container.querySelector('[data-testid="skill-marquee-track"]')).toBeNull();
  });
});
