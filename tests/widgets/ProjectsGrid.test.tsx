import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ProjectsGrid from "@/widgets/projects/ui/ProjectsGrid";

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({ reducedMotion: true, lowPerformance: false }),
}));

describe("ProjectsGrid", () => {
  it("contains the desktop grid within its available width", () => {
    render(<ProjectsGrid />);

    const anchor = document.querySelector(".projects-grid-anchor");
    const shell = document.querySelector(".projects-grid-shell");

    expect(anchor).toHaveClass("min-w-0", "max-w-full");
    expect(shell).toHaveClass("min-w-0", "max-w-full");
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
    expect(grid?.children[0]).toHaveClass("md:col-span-2");

    await user.click(detailButtons[1]);
    expect(detailButtons[0]).toHaveAttribute("aria-expanded", "false");
    expect(detailButtons[1]).toHaveAttribute("aria-expanded", "true");
    expect(grid?.children[0]).not.toHaveClass("md:col-span-2");
    expect(grid?.children[1]).toHaveClass("md:col-span-2");
  });
});
