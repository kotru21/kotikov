import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ProjectCardExpandable } from "@/entities/project";
import { projectsData } from "@/shared/config/content";

describe("ProjectCardExpandable", () => {
  it("uses bounded equal columns for expanded desktop details", () => {
    const { container } = render(
      <ProjectCardExpandable project={projectsData[0]} layout="desktop" isExpanded reducedMotion />
    );

    const expandableGrid = container.firstElementChild;

    expect(expandableGrid).toHaveStyle({
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
    });
    expect(expandableGrid?.getAttribute("style")).not.toContain("--project-card-w");
    expect(expandableGrid?.getAttribute("style")).not.toContain("--project-detail-w");
  });

  it("toggles inline details on desktop", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();

    render(
      <ProjectCardExpandable
        project={projectsData[0]}
        layout="desktop"
        isExpanded={false}
        onExpandedChange={onExpandedChange}
        reducedMotion
      />
    );

    await user.click(screen.getByRole("button", { name: /подробнее/i }));
    expect(onExpandedChange).toHaveBeenCalledWith(projectsData[0].slug);
  });
});
