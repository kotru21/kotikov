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

  it("contains detail column height so expand cannot grow the card row", () => {
    const { rerender } = render(
      <ProjectCardExpandable
        project={project}
        layout="desktop"
        isExpanded={false}
        reducedMotion
      />
    );

    const detailsColumn = screen.getByTestId("project-card-details-column");
    expect(detailsColumn.className).toMatch(/h-0/);
    expect(detailsColumn.className).toMatch(/min-h-full/);
    expect(detailsColumn.className).toMatch(/overflow-hidden/);

    rerender(
      <ProjectCardExpandable
        project={project}
        layout="desktop"
        isExpanded
        reducedMotion
      />
    );

    expect(detailsColumn.className).toMatch(/h-0/);
    expect(detailsColumn.className).toMatch(/min-h-full/);
    expect(screen.getByLabelText("Подробности проекта")).toHaveAttribute("aria-hidden", "false");
  });

  it("keeps aria-expanded in sync on the details toggle", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();

    const { rerender } = render(
      <ProjectCardExpandable
        project={project}
        layout="desktop"
        isExpanded={false}
        onExpandedChange={onExpandedChange}
        reducedMotion
      />
    );

    const toggle = screen.getByRole("button", { name: /подробнее/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(onExpandedChange).toHaveBeenCalledWith(project.slug);

    rerender(
      <ProjectCardExpandable
        project={project}
        layout="desktop"
        isExpanded
        onExpandedChange={onExpandedChange}
        reducedMotion
      />
    );

    expect(screen.getByRole("button", { name: /свернуть/i })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });
});
