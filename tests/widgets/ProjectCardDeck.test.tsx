import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { projectsData, projectsSection } from "@/shared/config/content";
import { ProjectCardDeck } from "@/widgets/projects/ui/ProjectCardDeck";

const PREV_PROJECT = "Предыдущий проект";
const NEXT_PROJECT = "Следующий проект";
const FIRST = projectsData[0];
const SECOND = projectsData[1];

function visibleTitles(): string[] {
  return projectsData
    .map((project) => project.title)
    .filter((title) => screen.queryByRole("heading", { name: title }) !== null);
}

function deckRegion(): HTMLElement {
  return screen.getByRole("region", { name: new RegExp(projectsSection.title) });
}

function slideWrappers(): HTMLElement[] {
  return [...deckRegion().querySelectorAll("article")].map((article) => {
    const parent = article.parentElement;
    if (!(parent instanceof HTMLElement)) {
      throw new Error("expected stacked slide wrapper");
    }
    return parent;
  });
}

describe("ProjectCardDeck", () => {
  it("shows one card, teal featured treatment, and timeline-style chevrons", () => {
    render(<ProjectCardDeck />);

    const carousel = deckRegion();
    expect(carousel).toHaveAttribute("aria-roledescription", "карусель");
    expect(carousel).toHaveClass("border-t-2");
    expect(visibleTitles()).toEqual([FIRST.title]);

    const articles = carousel.querySelectorAll("article");
    expect(articles[0]).toHaveClass(
      "bg-primary-500",
      "text-[#111]",
      "border-0",
      "min-w-0",
      "flex-col"
    );
    expect(articles[0].className).not.toMatch(/writing-mode/);
    expect(articles[1].className).not.toMatch(/bg-primary-500/);

    expect(screen.getByRole("button", { name: PREV_PROJECT })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: NEXT_PROJECT }));
    expect(visibleTitles()).toEqual([SECOND.title]);
  });

  it("locks band height by stacking every slide in one grid cell", () => {
    render(<ProjectCardDeck />);

    const wrappers = slideWrappers();
    expect(wrappers).toHaveLength(projectsData.length);
    expect(screen.getAllByRole("heading", { level: 3, hidden: true })).toHaveLength(
      projectsData.length
    );

    for (const wrap of wrappers) {
      expect(wrap).toHaveClass("col-start-1", "row-start-1", "grid", "min-w-0");
    }
    expect(wrappers.filter((wrap) => wrap.classList.contains("visible"))).toHaveLength(1);
    expect(wrappers.filter((wrap) => wrap.classList.contains("invisible"))).toHaveLength(
      projectsData.length - 1
    );

    fireEvent.click(screen.getByRole("button", { name: NEXT_PROJECT }));
    expect(visibleTitles()).toEqual([SECOND.title]);
    expect(slideWrappers().filter((wrap) => wrap.classList.contains("visible"))).toHaveLength(1);
  });

  it("keeps chevrons out of extra stroked cells", () => {
    render(<ProjectCardDeck />);

    const carousel = deckRegion();
    const live = carousel.querySelector("[aria-live='polite']");
    const track = live?.nextElementSibling;
    expect(live).toHaveClass("sr-only");
    expect(live).toHaveTextContent(FIRST.title);
    expect(carousel).toHaveAttribute(
      "aria-label",
      `${projectsSection.title}, 1 из ${String(projectsData.length)}`
    );
    expect(track).toHaveClass(
      "grid",
      "grid-cols-[auto_minmax(0,1fr)_auto]",
      "divide-x-2",
      "divide-[#111]"
    );
    expect(track?.className).not.toMatch(/gap-\[2px\]/);

    const prev = screen.getByRole("button", { name: PREV_PROJECT });
    const next = screen.getByRole("button", { name: NEXT_PROJECT });
    expect(prev.className).not.toContain("border-2");
    expect(next.className).not.toContain("border-2");
    expect(prev).toHaveClass("focus-visible:ring-2", "focus-visible:ring-inset");
    expect(next).toHaveClass("focus-visible:ring-2", "focus-visible:ring-inset");
  });

  it("advances from the focused band with ArrowRight", () => {
    render(<ProjectCardDeck />);

    const carousel = deckRegion();
    carousel.focus();
    fireEvent.keyDown(carousel, { key: "ArrowRight" });

    expect(visibleTitles()).toEqual([SECOND.title]);
    expect(screen.getByRole("button", { name: PREV_PROJECT })).toBeEnabled();
  });
});
