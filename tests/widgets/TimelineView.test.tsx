import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { sectionTitles, timelineData } from "@/shared/config/content";
import TimelineWidget from "@/widgets/timeline/TimelineWidget";
import { TimelineView } from "@/widgets/timeline/ui";

const PREV_STAGE = "Прокрутить к предыдущему этапу";
const NEXT_STAGE = "Прокрутить к следующему этапу";
const FIRST = timelineData[0];
const SECOND = timelineData[1];
const STROKE_CLASSES = [
  "border-2",
  "border-x-2",
  "border-y-2",
  "border-t-2",
  "border-b-2",
  "border-l-2",
  "border-r-2",
] as const;

function visibleItemTitles(): string[] {
  return timelineData
    .map((item) => item.title)
    .filter((title) => screen.queryByRole("heading", { name: title }) !== null);
}

function experienceRegion(): HTMLElement {
  return screen.getByRole("region", {
    name: new RegExp(sectionTitles.experience),
    hidden: true,
  });
}

function slideWrappers(): HTMLElement[] {
  return [...experienceRegion().querySelectorAll("article")].map((article) => {
    const parent = article.parentElement;
    if (!(parent instanceof HTMLElement)) {
      throw new Error("expected stacked slide wrapper");
    }
    return parent;
  });
}

function slidesGrid(): HTMLElement {
  const grid = slideWrappers()[0]?.parentElement;
  if (!(grid instanceof HTMLElement)) {
    throw new Error("expected slides grid");
  }
  return grid;
}

function carouselTrack(): HTMLElement {
  const track = experienceRegion().querySelector("[aria-live='polite']")?.nextElementSibling;
  if (!(track instanceof HTMLElement)) {
    throw new Error("expected carousel track");
  }
  return track;
}

function visibleArticle(): HTMLElement {
  const wrap = slideWrappers().find((el) => el.classList.contains("visible"));
  const article = wrap?.querySelector("article");
  if (!(article instanceof HTMLElement)) {
    throw new Error("expected visible timeline article");
  }
  return article;
}

function expectChevronHasNoStroke(button: HTMLElement): void {
  for (const className of STROKE_CLASSES) {
    expect(button).not.toHaveClass(className);
  }
}

function expectStackedSlideLock(): void {
  const wrappers = slideWrappers();
  expect(wrappers).toHaveLength(timelineData.length);
  expect(screen.getAllByRole("heading", { level: 3, hidden: true })).toHaveLength(
    timelineData.length
  );

  for (const wrap of wrappers) {
    expect(wrap).toHaveClass("col-start-1", "row-start-1", "grid", "min-w-0");
    expect(wrap.className.split(/\s+/)).not.toContain("hidden");
    expect(wrap.className.split(/\s+/).some((token) => token.includes("row-span"))).toBe(false);
  }
  expect(wrappers.filter((wrap) => wrap.classList.contains("visible"))).toHaveLength(1);
  expect(wrappers.filter((wrap) => wrap.classList.contains("invisible"))).toHaveLength(
    timelineData.length - 1
  );
  expect(wrappers.filter((wrap) => wrap.getAttribute("aria-hidden") === "true")).toHaveLength(
    timelineData.length - 1
  );
}

function expectProjectStyleChrome(): void {
  const region = experienceRegion();
  expect(region).toHaveClass("border-t-2");
  expect(region).not.toHaveClass("border-2", "border-x-2");
    expect(carouselTrack()).toHaveClass(
    "min-w-0",
    "grid-cols-[auto_minmax(0,1fr)_auto]",
    "divide-x-2",
    "divide-[#111]"
  );
  expect(slidesGrid()).toHaveClass("grid", "min-w-0");
  expect(slidesGrid()).not.toHaveClass("max-md:grid-rows-[auto_auto]");

  const prev = screen.getByRole("button", { name: PREV_STAGE });
  const next = screen.getByRole("button", { name: NEXT_STAGE });
  expectChevronHasNoStroke(prev);
  expectChevronHasNoStroke(next);
  expect(prev).toHaveClass("min-h-11", "min-w-11", "px-3", "self-stretch");
  expect(next).toHaveClass("min-h-11", "min-w-11", "px-3", "self-stretch");
}

describe("TimelineWidget", () => {
  it("renders a full-bleed #experience band with a visible h2", () => {
    const { container } = render(<TimelineWidget />);

    const section = container.querySelector("section#experience");
    expect(section).not.toBeNull();
    expect(section).not.toHaveClass("border-2");

    const heading = screen.getByRole("heading", { level: 2, name: sectionTitles.experience });
    expect(heading).toHaveAttribute("id", "experience-heading");
    expect(heading).toHaveClass("p-6", "md:p-10");
    expect(heading).not.toHaveClass("sr-only", "max-md:sr-only");
    expect(heading).not.toHaveClass("border-2");
    expect(heading).not.toHaveClass("bg-[#111]", "text-[#f5f5f3]", "bg-primary-500");
    expect(heading.className).not.toMatch(/dark:bg-\[#ededed\]/);

    const carousel = experienceRegion();
    expect(carousel).toHaveClass("border-t-2", "outline-none", "focus-visible:ring-2");
    expect(carousel).not.toHaveClass("border-x-2", "border-2");
    expect(carousel).toHaveAttribute(
      "aria-label",
      `${sectionTitles.experience}, 1 из ${String(timelineData.length)}`
    );
    expect(carousel.querySelector("[aria-live='polite']")).toHaveTextContent(FIRST.title);
  });
});

describe("TimelineView", () => {
  it("shows one item and project-style full-height chevrons", () => {
    render(<TimelineView />);

    expect(visibleItemTitles()).toEqual([FIRST.title]);
    expect(screen.getByText(FIRST.company)).toBeInTheDocument();
    expect(screen.getByText(FIRST.description)).toBeInTheDocument();
    expect(screen.getByText(FIRST.technologies[0])).toBeInTheDocument();
    expect(screen.getByText(FIRST.period)).toHaveClass("bg-primary-500", "text-[#111]");

    expect(visibleArticle()).toHaveClass("border-0");
    expect(visibleArticle()).not.toHaveClass("border-2", "border-x-2", "border-t-2");
    expectProjectStyleChrome();

    fireEvent.click(screen.getByRole("button", { name: NEXT_STAGE }));

    expect(visibleItemTitles()).toEqual([SECOND.title]);
  });

  it("locks band height by stacking every slide in one grid cell", () => {
    render(<TimelineView />);

    expectStackedSlideLock();
    fireEvent.click(screen.getByRole("button", { name: NEXT_STAGE }));

    const after = slideWrappers();
    expect(after).toHaveLength(timelineData.length);
    expect(after.filter((wrap) => wrap.classList.contains("visible"))).toHaveLength(1);
    expect(visibleItemTitles()).toEqual([SECOND.title]);
  });

  it("stacks date above copy on mobile and date beside copy on desktop", () => {
    render(<TimelineView />);

    expect(visibleArticle()).toHaveClass(
      "h-full",
      "min-h-0",
      "min-w-0",
      "grid-rows-[auto_1fr]",
      "md:grid-rows-none",
      "md:grid-cols-[minmax(11rem,16rem)_1fr]"
    );
    expect(visibleArticle()).not.toHaveClass("max-md:grid-rows-subgrid");
    expect(visibleArticle().children).toHaveLength(2);
    expect(visibleArticle().children[0]).toHaveClass("h-full", "min-h-0", "bg-primary-500", "text-[#111]");
    expect(visibleArticle().children[1]).toHaveClass("h-full", "min-h-0");
    expect(slideWrappers()[0]).toHaveClass("col-start-1", "row-start-1");
    expect(slideWrappers()[0]).not.toHaveClass("md:row-span-1", "row-end-2");
  });
});
