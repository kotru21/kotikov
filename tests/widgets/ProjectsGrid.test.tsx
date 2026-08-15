import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { projectsData } from "@/shared/config/content";
import { ProjectsGrid } from "@/widgets/projects/ui/ProjectsGrid";

describe("ProjectsGrid", () => {
  it("renders every project as a grid cell with the first card featured", () => {
    render(<ProjectsGrid />);

    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(projectsData.length);
    expect(articles[0]).toHaveClass("bg-primary-500", "text-[#111]", "border-0");
    expect(articles[0].className).not.toContain("border-2");
    expect(articles[1]).toHaveClass("border-0");
    expect(articles[1].className).not.toContain("border-2");
    expect(articles[1].className).toMatch(/bg-background-primary/);

    for (const project of projectsData) {
      expect(screen.getByRole("heading", { level: 3, name: project.title })).toBeInTheDocument();
    }
    expect(screen.getAllByRole("link", { name: "Код (откроется в новой вкладке)" })).toHaveLength(
      projectsData.length
    );

    const grid = screen.getByTestId("projects-grid");
    expect(grid).toHaveClass(
      "grid",
      "grid-cols-1",
      "content-start",
      "items-stretch",
      "border-t-2",
      "md:grid-cols-2",
      "xl:grid-cols-3"
    );
    expect(grid.className).not.toMatch(/divide-/);
    expect(grid.className).not.toMatch(/min-h-/);
    expect(screen.queryByRole("button", { name: /следующий проект/i })).not.toBeInTheDocument();
  });

  it("stretches cards to the row height without a decorative pattern layer", () => {
    render(<ProjectsGrid />);

    const grid = screen.getByTestId("projects-grid");
    for (const cell of Array.from(grid.children)) {
      expect(cell).toHaveClass("h-full", "min-h-0");
    }

    const articles = screen.getAllByRole("article");
    for (const article of articles) {
      expect(article).toHaveClass("border-0");
      expect(article.className).not.toContain("border-2");
      expect(article.className).toMatch(/h-full/);
      expect(article.className).toMatch(/min-h-0/);
      expect(article.className).toMatch(/min-w-0/);
      expect(article.className).toMatch(/flex-col/);
      expect(article.className).not.toMatch(/writing-mode/);
      expect(article.querySelector(".pointer-events-none")).toBeNull();
    }
    expect(grid.className).not.toMatch(/divide-/);
    expect(articles[0].className).toMatch(/md:flex-row/);
  });
});
