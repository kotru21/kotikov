import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectsGrid } from "@/widgets/projects/ui/ProjectsGrid";

describe("ProjectsGrid", () => {
  it("renders project cards with code links and no details toggle", () => {
    render(<ProjectsGrid />);

    const grid = screen.getByTestId("projects-grid");
    expect(within(grid).getAllByRole("article")).toHaveLength(3);
    expect(within(grid).getAllByRole("link", { name: /код/i })).toHaveLength(3);
    expect(within(grid).queryByRole("button", { name: /подробнее/i })).not.toBeInTheDocument();
  });

  it("keeps the last card wide on tablet breakpoints", () => {
    render(<ProjectsGrid />);

    const grid = screen.getByTestId("projects-grid");
    const cardRoots = Array.from(grid.children);
    expect(cardRoots).toHaveLength(3);
    expect(cardRoots[0]?.className).not.toMatch(/col-span-2/);
    expect(cardRoots[1]?.className).not.toMatch(/col-span-2/);
    expect(cardRoots[2]?.className).toMatch(/col-span-2/);
  });
});
