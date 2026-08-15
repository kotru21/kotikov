import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { ResponsiveViewMode } from "@/features/device/client";
import { sectionTitles, timelineData } from "@/shared/config/content";
import TimelineWidget from "@/widgets/timeline/TimelineWidget";
import { TimelineView } from "@/widgets/timeline/ui";

const viewMode = vi.hoisted((): { current: ResponsiveViewMode } => ({ current: "desktop" }));

vi.mock("@/features/device/client", () => ({
  useResponsiveViewMode: () => viewMode.current,
}));

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
    expect(wrap).toHaveClass("col-start-1", "row-start-1", "grid");
  }
  expect(wrappers.filter((wrap) => wrap.classList.contains("visible"))).toHaveLength(1);
  expect(wrappers.filter((wrap) => wrap.classList.contains("invisible"))).toHaveLength(
    timelineData.length - 1
  );
  expect(wrappers.filter((wrap) => wrap.getAttribute("aria-hidden") === "true")).toHaveLength(
    timelineData.length - 1
  );
}

describe("TimelineWidget", () => {
  it("renders a full-bleed #experience band with desktop-only h2", () => {
    viewMode.current = "desktop";
    const { container } = render(<TimelineWidget />);

    const section = container.querySelector("section#experience");
    expect(section).not.toBeNull();
    expect(section).not.toHaveClass("border-2");

    const heading = screen.getByRole("heading", { level: 2, name: sectionTitles.experience });
    expect(heading).toHaveAttribute("id", "experience-heading");
    expect(heading).toHaveClass("sr-only", "md:not-sr-only");
    expect(heading).not.toHaveClass("border-2");
    expect(heading).not.toHaveClass("bg-[#111]", "text-[#f5f5f3]", "bg-primary-500");
    expect(heading.className).not.toMatch(/dark:bg-\[#ededed\]/);

    const carousel = experienceRegion();
    expect(carousel).not.toHaveClass("border-t-2");
    expect(carousel).not.toHaveClass("border-x-2");
    expect(carousel).not.toHaveClass("border-2");
    expect(carousel).toHaveClass("outline-none", "focus-visible:ring-2");
    expect(carousel).toHaveAttribute(
      "aria-label",
      `${sectionTitles.experience}, 1 из ${String(timelineData.length)}`
    );
    expect(carousel.querySelector("[aria-live='polite']")).toHaveTextContent(FIRST.title);
  });
});

describe("TimelineView", () => {
  it("shows one item and chevrons on desktop", () => {
    viewMode.current = "desktop";
    render(<TimelineView />);

    expect(visibleItemTitles()).toEqual([FIRST.title]);
    expect(screen.getByText(FIRST.company)).toBeInTheDocument();
    expect(screen.getByText(FIRST.description)).toBeInTheDocument();
    expect(screen.getByText(FIRST.technologies[0])).toBeInTheDocument();
    expect(screen.getByText(FIRST.period)).toHaveClass("bg-primary-500", "text-[#111]");

    expect(visibleArticle()).toHaveClass("border-t-2");
    expect(visibleArticle()).not.toHaveClass("border-2");
    expect(visibleArticle()).not.toHaveClass("border-x-2");
    expect(visibleArticle()).not.toHaveClass("border-b-2");
    expectChevronHasNoStroke(screen.getByRole("button", { name: PREV_STAGE }));
    expectChevronHasNoStroke(screen.getByRole("button", { name: NEXT_STAGE }));

    fireEvent.click(screen.getByRole("button", { name: NEXT_STAGE }));

    expect(visibleItemTitles()).toEqual([SECOND.title]);
  });

  it.each(["desktop", "mobile"] as const)(
    "locks %s band height by stacking every slide in one grid cell",
    (mode) => {
      viewMode.current = mode;
      render(<TimelineView />);

      expectStackedSlideLock();
      fireEvent.click(screen.getByRole("button", { name: NEXT_STAGE }));

      const after = slideWrappers();
      expect(after).toHaveLength(timelineData.length);
      expect(after.filter((wrap) => wrap.classList.contains("visible"))).toHaveLength(1);
      expect(visibleItemTitles()).toEqual([SECOND.title]);
    }
  );

  it("shows one item and chevrons on mobile without doubling section strokes", () => {
    viewMode.current = "mobile";
    render(<TimelineView />);

    expect(visibleItemTitles()).toEqual([FIRST.title]);
    expect(screen.getByText(FIRST.period)).toHaveClass("bg-primary-500", "text-[#111]");

    expect(visibleArticle()).toHaveClass("border-0");
    expect(visibleArticle()).not.toHaveClass("border-2");
    expect(visibleArticle()).not.toHaveClass("border-x-2");
    expectChevronHasNoStroke(screen.getByRole("button", { name: PREV_STAGE }));
    expectChevronHasNoStroke(screen.getByRole("button", { name: NEXT_STAGE }));

    fireEvent.click(screen.getByRole("button", { name: NEXT_STAGE }));

    expect(visibleItemTitles()).toEqual([SECOND.title]);
  });
});
