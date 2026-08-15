import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { ResponsiveViewMode } from "@/features/device/client";
import { projectsData, projectsSection } from "@/shared/config/content";
import { ProjectsWidget } from "@/widgets/projects";

const viewMode = vi.hoisted((): { current: ResponsiveViewMode } => ({ current: "desktop" }));

vi.mock("@/features/device/client", () => ({
  useResponsiveViewMode: () => viewMode.current,
}));

describe("ProjectsWidget", () => {
  it("renders a full-bleed #projects band with desktop-only h2 and body description", () => {
    viewMode.current = "desktop";
    const { container } = render(<ProjectsWidget />);

    const section = container.querySelector("section#projects");
    expect(section).not.toBeNull();
    expect(section).not.toHaveClass("border-2");
    expect(section?.firstElementChild?.className).toMatch(/max-w-none/);
    expect(section?.firstElementChild?.className).not.toMatch(/max-w-6xl/);

    const intro = section?.querySelector(":scope > div > div");
    expect(intro).not.toHaveClass("border-2");
    expect(intro).not.toHaveClass("border-x-2");
    expect(intro).not.toHaveClass("border-b-2");

    const grid = screen.getByTestId("projects-grid");
    expect(grid).toHaveClass("border-t-2");

    const heading = screen.getByRole("heading", { level: 2, name: projectsSection.title });
    expect(heading).toHaveAttribute("id", "projects-heading");
    expect(heading).toHaveClass("sr-only", "md:not-sr-only");
    expect(heading).not.toHaveClass("bg-[#111]", "bg-primary-500");
    expect(screen.getByText(projectsSection.description)).toBeInTheDocument();
  });

  it("shows the editorial grid on desktop instead of a carousel", () => {
    viewMode.current = "desktop";
    render(<ProjectsWidget />);

    expect(screen.getAllByRole("article")).toHaveLength(projectsData.length);
    expect(screen.getByRole("heading", { level: 3, name: "evtxview" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "CodeAnalyzer" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Следующий проект" })).not.toBeInTheDocument();
    expect(screen.queryByTestId("projects-deck")).not.toBeInTheDocument();
  });

  it("shows the mobile deck instead of stacking every card", () => {
    viewMode.current = "mobile";
    render(<ProjectsWidget />);

    const deck = screen.getByTestId("projects-deck");
    expect(deck).toBeInTheDocument();
    expect(screen.getByTestId("projects-grid").parentElement).toHaveClass("hidden", "md:block");
    expect(within(deck).getByRole("heading", { level: 3, name: "evtxview" })).toBeInTheDocument();
    expect(
      within(deck).queryByRole("heading", { level: 3, name: "CodeAnalyzer" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Следующий проект" })).toBeInTheDocument();
  });

  it("sizes the band to heading, intro and grid without a vacant slab under the cards", () => {
    viewMode.current = "desktop";
    const { container } = render(<ProjectsWidget />);

    const section = container.querySelector("section#projects");
    expect(section?.className).not.toMatch(/min-h-/);
    expect(section?.className).not.toMatch(/h-dvh|h-screen|h-full/);

    const intro = section?.querySelector(":scope > div > div");
    expect(intro?.className).toMatch(/justify-start/);
    expect(intro?.className).not.toMatch(/min-h-/);

    const grid = screen.getByTestId("projects-grid");
    expect(grid).toHaveClass("content-start", "items-stretch");
    expect(grid.className).not.toMatch(/min-h-/);
    expect(grid.className).not.toMatch(/flex-1/);
  });
});
