import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { skillsData } from "@/shared/config/content";
import { SkillsInteractionProvider } from "@/widgets/skills/model/SkillsInteractionContext";
import { SkillMarqueeCard, SkillMarqueeRow, SkillsDesktopView, SkillsMobileView } from "@/widgets/skills/ui";
import SkillsCursorNyancat from "@/widgets/skills/ui/SkillsCursorNyancat";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { alt = "", ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element -- test stub
    return <img alt={String(alt)} {...rest} />;
  },
}));

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({ reducedMotion: false, lowPerformance: false }),
  useSceneMotionPolicy: () => ({ canRunContinuous: true }),
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

  it("renders SkillMarqueeCard and toggles active element", () => {
    render(
      <SkillsInteractionProvider>
        <SkillMarqueeCard skill={skillsData[0]} />
      </SkillsInteractionProvider>
    );

    const card = screen.getByText(skillsData[0].name).closest("[aria-hidden='true']");
    expect(card).toBeTruthy();
    fireEvent.mouseEnter(card!);
    fireEvent.mouseLeave(card!);
  });

  it("runs curved marquee arc updates while motion is active", () => {
    render(
      <SkillsInteractionProvider>
        <SkillMarqueeRow skills={skillsData.slice(0, 2)} curved isMotionActive />
      </SkillsInteractionProvider>
    );

    expect(screen.getByTestId("skill-marquee-track")).toHaveAttribute("data-motion-active", "true");
  });

  it("renders flat marquee track when not curved", () => {
    render(
      <SkillsInteractionProvider>
        <SkillMarqueeRow skills={skillsData.slice(0, 1)} isMotionActive={false} />
      </SkillsInteractionProvider>
    );

    expect(screen.getByTestId("skill-marquee-track")).toHaveStyle({
      animationPlayState: "paused",
    });
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

  it("renders desktop and mobile skills views", () => {
    const { rerender } = render(<SkillsDesktopView headingId="skills-heading-desktop" />);
    const desktopGroup = screen.getByRole("group", { name: "Мои навыки" });
    expect(desktopGroup).toBeInTheDocument();

    fireEvent.pointerEnter(desktopGroup);
    fireEvent.pointerLeave(desktopGroup);

    rerender(<SkillsMobileView headingId="skills-heading-mobile" />);
    expect(screen.getByRole("heading", { name: "Мои навыки" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /LinkedIn/i })).toBeInTheDocument();
  });
});
