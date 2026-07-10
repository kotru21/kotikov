/* eslint-disable @typescript-eslint/naming-convention -- vi.mock keys match component exports */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HeaderWidget from "@/widgets/header/HeaderWidget";

vi.mock("@/features/device", () => ({
  useIsMobile: () => false,
}));

vi.mock("@/features/interactive-elements", () => ({
  InteractiveTextContext: ({ children }: { children: React.ReactNode }) => children,
  useInteractiveCollision: () => ({ checkCollisions: vi.fn() }),
  useInteractiveRegistry: () => ({
    registry: {},
    interactiveElementsRef: { current: [] },
  }),
}));

vi.mock("@/features/paw", () => ({
  usePawAnimation: () => ({
    isDrawing: false,
    handlers: {
      handlePointerEnter: vi.fn(),
      handlePointerMove: vi.fn(),
      handlePointerLeave: vi.fn(),
      handlePointerDown: vi.fn(),
      handlePointerUp: vi.fn(),
      handlePointerCancel: vi.fn(),
    },
  }),
}));

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({ reducedMotion: false, lowPerformance: false }),
  useSceneMotionPolicy: () => ({
    reducedMotion: false,
    lowPerformance: false,
    isInView: false,
    isDocumentVisible: true,
    dominantEffect: "flying-nyancat",
    canRunContinuous: false,
  }),
}));

vi.mock("@/widgets/header/ui", async () => {
  const actual = await vi.importActual<Record<string, unknown>>("@/widgets/header/ui");
  return {
    ...actual,
    HeaderBackground: () => null,
    HeaderHero: () => <section aria-label="Hero content" />,
    HeaderNavigation: () => <nav aria-label="Global navigation" />,
  };
});

describe("HeaderWidget", () => {
  it("places the main content target after global navigation around the hero", () => {
    const { container } = render(<HeaderWidget />);

    const targets = container.querySelectorAll("#main-content");
    const target = targets.item(0);
    const globalNavigation = screen.getByRole("navigation", { name: "Global navigation" });
    const hero = screen.getByRole("region", { name: "Hero content" });

    expect(targets).toHaveLength(1);
    expect(target).toHaveAttribute("tabindex", "-1");
    expect(
      globalNavigation.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING
    ).not.toBe(0);
    expect(target).toContainElement(hero);
  });

  it("pauses flying Nyancat while the scene motion policy is inactive", () => {
    render(<HeaderWidget />);

    expect(screen.queryByTestId("header-nyancat")).not.toHaveStyle({
      animationPlayState: "running",
    });
  });
});
