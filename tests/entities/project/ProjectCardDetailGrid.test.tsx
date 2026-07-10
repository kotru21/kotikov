import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectCardDetailGrid } from "@/entities/project";
import { projectsData } from "@/shared/config/content";

describe("ProjectCardDetailGrid", () => {
  const project = projectsData[0];

  it("renders four storytelling cells and stack tags", () => {
    render(
      <ProjectCardDetailGrid
        project={project}
        id="project-details-code-analyzer"
        isVisible
        reducedMotion
      />
    );

    expect(screen.getByRole("region", { name: /подробности проекта/i })).toBeInTheDocument();
    expect(screen.getByText("Задача")).toBeInTheDocument();
    expect(screen.getByText(project.details.challenge)).toBeInTheDocument();
    expect(screen.getByText("Решение")).toBeInTheDocument();
    expect(screen.getByText(project.details.solution)).toBeInTheDocument();
    expect(screen.getByText("Результат")).toBeInTheDocument();
    expect(screen.getByText(project.details.outcome)).toBeInTheDocument();
    expect(screen.getByText("Стек")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
  });

  it("renders horizontal 2x2 grid when orientation is horizontal", () => {
    const { container } = render(
      <ProjectCardDetailGrid
        project={project}
        id="project-details-horizontal"
        isVisible
        reducedMotion
        orientation="horizontal"
      />
    );

    const list = container.querySelector("dl");
    expect(list?.className).toContain("grid-cols-2");
    expect(list?.className).toContain("min-h-0");
    expect(list?.className).not.toContain("min-h-[22rem]");
  });

  it("contains horizontal cells without visible scrollbars or horizontal overflow", () => {
    const { container } = render(
      <ProjectCardDetailGrid
        project={project}
        id="project-details-scroll"
        isVisible
        reducedMotion
        orientation="horizontal"
      />
    );

    const list = container.querySelector("dl");
    expect(list?.className).toMatch(/min-w-0/);

    const cells = container.querySelectorAll("dl > div");
    expect(cells.length).toBe(4);
    for (const cell of cells) {
      expect(cell.className).toMatch(/min-h-0/);
      expect(cell.className).toMatch(/min-w-0/);
      expect(cell.className).toMatch(/overflow-y-auto/);
      expect(cell.className).toMatch(/overflow-x-hidden/);
      expect(cell.className).toMatch(/scrollbar-none/);
      expect(cell.className).toMatch(/\[&::-webkit-scrollbar\]:hidden/);
    }
  });
});
