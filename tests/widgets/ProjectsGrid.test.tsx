import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProjectsGrid from "@/widgets/projects/ui/ProjectsGrid";

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({ reducedMotion: true, lowPerformance: false }),
}));

describe("ProjectsGrid", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe = vi.fn();
        disconnect = vi.fn();
      }
    );

    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("1280"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1440,
      writable: true,
    });
  });

  it("keeps only one desktop card expanded in the accordion", async () => {
    const user = userEvent.setup();

    render(<ProjectsGrid />);

    const grid = document.querySelector(".projects-grid");
    expect(grid).not.toBeNull();

    const detailButtons = within(grid as HTMLElement).getAllByRole("button", {
      name: /подробнее/i,
    });

    await user.click(detailButtons[0]);
    expect(detailButtons[0]).toHaveAttribute("aria-expanded", "true");
    expect(detailButtons[1]).toHaveAttribute("aria-expanded", "false");

    await user.click(detailButtons[1]);
    expect(detailButtons[0]).toHaveAttribute("aria-expanded", "false");
    expect(detailButtons[1]).toHaveAttribute("aria-expanded", "true");
  });

  it("expands the selected column without compressing sibling cards", async () => {
    const user = userEvent.setup();

    render(<ProjectsGrid />);

    const shell = screen.getByTestId("projects-grid-shell");
    expect(shell).toHaveAttribute("data-expanded", "none");

    const grid = document.querySelector(".projects-grid");
    expect(grid).not.toBeNull();

    const detailButtons = within(grid as HTMLElement).getAllByRole("button", {
      name: /подробнее/i,
    });
    expect(detailButtons).toHaveLength(3);

    await user.click(detailButtons[1]);

    expect(shell).toHaveAttribute("data-expanded", "1");
    expect(detailButtons[1]).toHaveAttribute("aria-expanded", "true");
    expect(detailButtons[0]).toHaveAttribute("aria-expanded", "false");
    expect(detailButtons[2]).toHaveAttribute("aria-expanded", "false");

    const toggleButtons = within(grid as HTMLElement).getAllByRole("button", {
      name: /подробнее|свернуть/i,
    });
    expect(toggleButtons).toHaveLength(3);
    expect(toggleButtons[1]).toHaveAttribute("aria-expanded", "true");
    expect(toggleButtons[1]).toHaveAccessibleName(/свернуть/i);

    if (!(grid instanceof HTMLElement)) {
      throw new Error("Expected projects grid element");
    }
    const cardRoots = Array.from(grid.children);
    expect(cardRoots).toHaveLength(3);
    for (const card of cardRoots) {
      expect(card.className).not.toMatch(/col-span-2/);
    }
  });
});
