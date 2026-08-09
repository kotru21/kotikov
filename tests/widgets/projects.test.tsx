import { act, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders section chrome and prunes to the desktop grid after matchMedia sync", async () => {
    render(<ProjectsWidget />);

    const section = document.getElementById("projects");
    expect(section).not.toBeNull();
    expect(screen.getByRole("heading", { name: projectsSection.title })).toBeInTheDocument();
    expect(screen.getByText(projectsSection.eyebrow)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole("region", { name: "Избранные проекты" })).not.toBeInTheDocument();
    });

    const grid = screen.getByTestId("projects-grid");
    expect(within(grid).getAllByRole("link", { name: /код/i })).toHaveLength(projectsData.length);
    expect(screen.queryByRole("button", { name: /подробнее/i })).not.toBeInTheDocument();
    expect(screen.getAllByText("CodeAnalyzer")).toHaveLength(1);
  });

  it("prunes to the mobile deck when matchMedia reports a narrow viewport", async () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("max-width"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<ProjectsWidget />);

    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.queryByTestId("projects-grid")).not.toBeInTheDocument();
    });
    expect(screen.getByRole("region", { name: "Избранные проекты" })).toBeInTheDocument();
  });
});
