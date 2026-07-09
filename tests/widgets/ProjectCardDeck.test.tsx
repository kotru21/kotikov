/* eslint-disable @typescript-eslint/naming-convention -- vi.mock factory keys must match named exports */
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { projectsData } from "@/shared/config/content";
import ProjectCardDeck from "@/widgets/projects/ui/ProjectCardDeck";

vi.mock("@/entities/project", () => ({
  ProjectCardExpandable: () => <div />,
}));

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({ reducedMotion: true, lowPerformance: false }),
}));

describe("ProjectCardDeck semantics", () => {
  it("exposes the carousel and native project controls", () => {
    render(<ProjectCardDeck />);

    const carousel = screen.getByRole("region", { name: "Избранные проекты" });
    const controls = screen.getByRole("group", { name: "Выбор проекта" });
    const projectButtons = within(controls).getAllByRole("button", {
      name: /Выбрать проект/,
    });

    expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
    expect(controls).not.toHaveAttribute("tabindex");
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(projectButtons).toHaveLength(projectsData.length);
    expect(
      within(controls).getByRole("button", {
        name: `Выбрать проект ${projectsData[0].title}`,
      })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("labels the active project as a carousel slide", () => {
    render(<ProjectCardDeck />);

    const activeSlide = screen.getByRole("group", {
      name: `1 из ${String(projectsData.length)}: ${projectsData[0].title}`,
    });

    expect(activeSlide).toHaveAttribute("aria-roledescription", "слайд");
  });
});
