import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { projectsData, projectsSection } from "@/shared/config/content";
import { ProjectsWidget } from "@/widgets/projects";

describe("ProjectsWidget", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  it("renders the section chrome, dual trees, and action links per project", () => {
    render(<ProjectsWidget />);

    const section = document.getElementById("projects");
    expect(section).not.toBeNull();
    expect(screen.getByRole("heading", { name: projectsSection.title })).toBeInTheDocument();
    expect(screen.getByText(projectsSection.eyebrow)).toBeInTheDocument();

    const carousel = screen.getByRole("region", { name: "Избранные проекты" });
    const grid = screen.getByTestId("projects-grid");

    // JSDOM ignores CSS visibility: active (non-inert) deck slide + full grid are both exposed.
    // Inactive deck slides use aria-hidden + inert, so only one deck "Код" link is queryable.
    expect(within(carousel).getAllByRole("link", { name: /код/i })).toHaveLength(1);
    expect(within(grid).getAllByRole("link", { name: /код/i })).toHaveLength(projectsData.length);
    expect(screen.queryByRole("button", { name: /подробнее/i })).not.toBeInTheDocument();
    expect(screen.getAllByText("CodeAnalyzer")).toHaveLength(2);
  });
});
