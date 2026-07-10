import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ProjectCard } from "@/entities/project";
import { projectsData } from "@/shared/config/content";

describe("ProjectCard details toggle", () => {
  const project = projectsData[0];
  const controlsId = "project-details-code-analyzer";

  it("renders toggle with aria-expanded false and aria-controls", () => {
    render(
      <ProjectCard
        project={project}
        detailsToggle={{
          isExpanded: false,
          controlsId,
          onToggle: vi.fn(),
        }}
      />
    );

    const button = screen.getByRole("button", { name: /подробнее/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", controlsId);
  });

  it("shows the project outcome while collapsed", () => {
    render(
      <ProjectCard
        project={project}
        detailsToggle={{
          isExpanded: false,
          controlsId,
          onToggle: vi.fn(),
        }}
      />
    );

    const outcomeParagraph = screen.getByText("Результат").closest("p");

    expect(outcomeParagraph).toBeVisible();
    expect(outcomeParagraph).toHaveTextContent(`Результат ${project.details.outcome}`);
  });

  it("hides the card outcome while expanded to avoid duplicating the detail grid", () => {
    render(
      <ProjectCard
        project={project}
        detailsToggle={{
          isExpanded: true,
          controlsId,
          onToggle: vi.fn(),
        }}
      />
    );

    expect(screen.queryByText("Результат")).not.toBeInTheDocument();
    expect(screen.queryByText(project.details.outcome)).not.toBeInTheDocument();
  });

  it("calls onToggle when clicked", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    render(
      <ProjectCard
        project={project}
        detailsToggle={{
          isExpanded: false,
          controlsId,
          onToggle,
        }}
      />
    );

    await user.click(screen.getByRole("button", { name: /подробнее/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("shows Свернуть with aria-expanded true when expanded", () => {
    render(
      <ProjectCard
        project={project}
        detailsToggle={{
          isExpanded: true,
          controlsId,
          onToggle: vi.fn(),
        }}
      />
    );

    const button = screen.getByRole("button", { name: /свернуть/i });
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("aria-controls", controlsId);
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
});
