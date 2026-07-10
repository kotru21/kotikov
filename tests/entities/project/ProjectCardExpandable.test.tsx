import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ProjectCardExpandable } from "@/entities/project";
import { projectsData } from "@/shared/config/content";

describe("ProjectCardExpandable", () => {
  const project = projectsData[0];

  it("toggles inline details on desktop", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();

    render(
      <ProjectCardExpandable
        project={project}
        layout="desktop"
        isExpanded={false}
        onExpandedChange={onExpandedChange}
        reducedMotion
      />
    );

    await user.click(screen.getByRole("button", { name: /подробнее/i }));
    expect(onExpandedChange).toHaveBeenCalledWith(project.slug);
  });

  it("keeps outcome out of the collapsed card face", () => {
    render(
      <ProjectCardExpandable
        project={project}
        layout="desktop"
        isExpanded={false}
        reducedMotion
      />
    );

    const card = screen.getByRole("article");
    expect(within(card).queryByText("Результат")).not.toBeInTheDocument();
    expect(within(card).queryByText(project.details.outcome)).not.toBeInTheDocument();
    expect(screen.getByLabelText("Подробности проекта")).toHaveAttribute("aria-hidden", "true");
  });

  it("shows outcome once in the detail grid when expanded", () => {
    render(
      <ProjectCardExpandable
        project={project}
        layout="desktop"
        isExpanded
        reducedMotion
      />
    );

    const labels = screen.getAllByText("Результат");
    expect(labels).toHaveLength(1);
    expect(screen.getByText(project.details.outcome)).toBeInTheDocument();
    expect(screen.getByLabelText("Подробности проекта")).toHaveAttribute("aria-hidden", "false");
  });
});
