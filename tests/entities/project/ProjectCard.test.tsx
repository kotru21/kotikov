import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectCard } from "@/entities/project";
import { projectsData } from "@/shared/config/content";

describe("ProjectCard", () => {
  const project = projectsData[0];

  it("renders title, summary and code link", () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByRole("heading", { name: project.title })).toBeInTheDocument();
    expect(screen.getByText(project.summary)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Код (откроется в новой вкладке)" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /подробнее/i })).not.toBeInTheDocument();
  });

  it("uses Russian accessible names for external project links", () => {
    render(<ProjectCard project={{ ...project, liveUrl: "https://example.com" }} />);

    expect(
      screen.getByRole("link", { name: "Код (откроется в новой вкладке)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Демо (откроется в новой вкладке)" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Live")).not.toBeInTheDocument();
  });

  it("renders a short horizontal layout when wideOnTablet", () => {
    const { container } = render(<ProjectCard project={project} wideOnTablet />);

    const card = container.querySelector("article");
    expect(card?.className).toMatch(/flex-row/);
    expect(card?.className).toMatch(/min-h-56/);
    expect(card?.className).toMatch(/xl:flex-col/);
  });
});
