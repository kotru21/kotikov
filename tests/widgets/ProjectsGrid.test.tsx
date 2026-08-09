import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { projectsData } from "@/shared/config/content";
import { ProjectsGrid } from "@/widgets/projects/ui/ProjectsGrid";

describe("ProjectsGrid", () => {
  it("renders project cards with code links and no details toggle", () => {
    render(<ProjectsGrid />);

    const grid = screen.getByTestId("projects-grid");
    expect(within(grid).getAllByRole("article")).toHaveLength(projectsData.length);
    expect(within(grid).getAllByRole("link", { name: /код/i })).toHaveLength(projectsData.length);
    expect(within(grid).queryByRole("button", { name: /подробнее/i })).not.toBeInTheDocument();
  });

  it("spans the first card full-width and widens an orphan on tablet", () => {
    render(<ProjectsGrid />);

    const grid = screen.getByTestId("projects-grid");
    const cardRoots = Array.from(grid.children);
    expect(cardRoots).toHaveLength(projectsData.length);

    expect(cardRoots[0]?.className).toMatch(/col-span-full/);

    const remaining = projectsData.length - 1;
    const orphanIndex = remaining % 2 === 1 ? remaining : -1;

    for (const [index, root] of cardRoots.entries()) {
      if (index === 0) continue;
      if (index === orphanIndex) {
        expect(root.className).toMatch(/col-span-2/);
      } else {
        expect(root.className).not.toMatch(/col-span/);
      }
    }
  });
});
