import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ProjectDetailSheet } from "@/entities/project";
import { projectsData } from "@/shared/config/content";

describe("ProjectDetailSheet", () => {
  it("calls onClose when escape is pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const project = projectsData[1];

    render(
      <ProjectDetailSheet project={project} isOpen onClose={onClose} reducedMotion />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when overlay is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <ProjectDetailSheet project={projectsData[1]} isOpen onClose={onClose} reducedMotion />,
    );

    await user.click(screen.getByTestId("project-detail-overlay"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("applies motion transition classes when reducedMotion is disabled", () => {
    render(
      <ProjectDetailSheet project={projectsData[1]} isOpen onClose={vi.fn()} reducedMotion={false} />,
    );

    expect(screen.getByTestId("project-detail-overlay").className).toContain("transition-opacity");
    expect(screen.getByRole("dialog", { hidden: true }).className).toContain("transition-transform");
    expect(screen.getByRole("dialog", { hidden: true }).className).toContain("translate-y-full");
  });
});
