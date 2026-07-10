/* eslint-disable @typescript-eslint/naming-convention -- vi.mock factory keys must match named exports */
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { projectsData } from "@/shared/config/content";
import ProjectCardDeck from "@/widgets/projects/ui/ProjectCardDeck";

vi.mock("@/entities/project", () => ({
  ProjectCard: () => <div />,
}));

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({ reducedMotion: true, lowPerformance: false }),
}));

function getProjectControl(index: number): HTMLElement {
  return screen.getByRole("button", {
    name: `Выбрать проект ${projectsData[index].title}`,
  });
}

describe("ProjectCardDeck semantics", () => {
  it("exposes the carousel and native project controls", () => {
    render(<ProjectCardDeck />);

    const carousel = screen.getByRole("region", { name: "Избранные проекты" });
    const controls = screen.getByRole("group", { name: "Выбор проекта" });
    const projectButtons = within(controls).getAllByRole("button", {
      name: /Выбрать проект/,
    });

    expect(carousel).toHaveAttribute("aria-roledescription", "карусель");
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

  it("synchronizes focus, state, slide, and counter for keyboard navigation", () => {
    render(<ProjectCardDeck />);
    const firstControl = getProjectControl(0);
    const secondControl = getProjectControl(1);

    firstControl.focus();
    fireEvent.keyDown(firstControl, { key: "ArrowRight" });

    expect(secondControl).toHaveFocus();
    expect(firstControl).toHaveAttribute("aria-pressed", "false");
    expect(secondControl).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("group", {
        name: `2 из ${String(projectsData.length)}: ${projectsData[1].title}`,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(`2 / ${String(projectsData.length)}`)).toBeInTheDocument();
  });

  it("moves focus to the Home and End destinations", () => {
    render(<ProjectCardDeck />);
    const firstControl = getProjectControl(0);
    const secondControl = getProjectControl(1);
    const lastControl = getProjectControl(projectsData.length - 1);

    secondControl.focus();
    fireEvent.keyDown(secondControl, { key: "End" });
    expect(lastControl).toHaveFocus();
    fireEvent.keyDown(lastControl, { key: "Home" });
    expect(firstControl).toHaveFocus();
  });

  it("sizes the deck from active card content instead of a fixed 28rem height", () => {
    render(<ProjectCardDeck />);

    const deck = screen.getByRole("region", { name: "Избранные проекты" });
    const stack = deck.querySelector(".relative.mx-auto");

    expect(stack).not.toBeNull();
    expect(deck.querySelector('[style*="28rem"]')).toBeNull();
    expect(stack).toHaveClass("grid", "w-full", "max-w-md");
    if (!(stack instanceof HTMLElement)) {
      throw new Error("Expected deck stack element");
    }
    expect(stack.querySelectorAll(".col-start-1.row-start-1").length).toBe(projectsData.length);
  });
});
