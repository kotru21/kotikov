import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { projectsData } from "@/shared/config/content";
import { ProjectCardDetailGrid } from "@/entities/project/ui/ProjectCardDetailGrid";

describe("ProjectCardDetailGrid", () => {
  const project = projectsData[0];

  it("renders four storytelling cells and stack tags", () => {
    render(
      <ProjectCardDetailGrid
        project={project}
        id="project-details-file-manager-tauri"
        isVisible
        reducedMotion
      />,
    );

    expect(screen.getByRole("region", { name: /подробности проекта/i })).toBeInTheDocument();
    expect(screen.getByText("Задача")).toBeInTheDocument();
    expect(screen.getByText(project.details.challenge)).toBeInTheDocument();
    expect(screen.getByText("Решение")).toBeInTheDocument();
    expect(screen.getByText(project.details.solution)).toBeInTheDocument();
    expect(screen.getByText("Результат")).toBeInTheDocument();
    expect(screen.getByText(project.details.outcome)).toBeInTheDocument();
    expect(screen.getByText("Стек")).toBeInTheDocument();
    expect(screen.getByText("Tauri")).toBeInTheDocument();
  });
});
