import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ProjectCardExpandable } from "@/entities/project";
import { projectsData } from "@/shared/config/content";

describe("ProjectCardExpandable", () => {
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
