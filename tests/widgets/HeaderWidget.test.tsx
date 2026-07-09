/* eslint-disable @typescript-eslint/naming-convention -- vi.mock keys match component exports */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HeaderWidget from "@/widgets/header/HeaderWidget";

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
}));

vi.mock("@/widgets/header/ui", () => ({
  HeaderBackground: () => null,
  HeaderHero: () => <section aria-label="Hero content" />,
  HeaderNavigation: () => <nav aria-label="Global navigation" />,
  HeaderNyancat: () => null,
}));

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
});
