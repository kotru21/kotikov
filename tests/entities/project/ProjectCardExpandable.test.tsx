import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { projectsData } from "@/shared/config/content";
import { ProjectCardExpandable } from "@/entities/project/ui/ProjectCardExpandable";

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({ reducedMotion: true, lowPerformance: false }),
}));

describe("ProjectCardExpandable", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("min-width: 768px") ? true : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
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
      />,
    );

    await user.click(screen.getByRole("button", { name: /подробнее/i }));
    expect(onExpandedChange).toHaveBeenCalledWith(projectsData[0].slug);
  });
});
