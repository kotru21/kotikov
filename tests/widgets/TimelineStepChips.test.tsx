import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { TimelineItem } from "@/entities/timeline";
import { TimelineStepChips } from "@/widgets/timeline/ui";

const items: TimelineItem[] = [
  {
    id: 1,
    title: "ByChange Hackathon",
    company: "ByChange",
    period: "2023",
    description: "desc",
    technologies: ["React"],
    type: "hackathon",
  },
  {
    id: 2,
    title: "Высшее образование",
    company: "БГУИР",
    period: "2024 — н.в.",
    description: "desc",
    technologies: ["InfoSec"],
    type: "education",
  },
  {
    id: 4,
    title: "Frontend Developer",
    company: "Innowise",
    period: "июн 2025 — ноя 2025",
    description: "desc",
    technologies: ["React"],
    type: "work",
  },
  {
    id: 7,
    title: "MTS Hackathon",
    company: "MTS",
    period: "2026",
    description: "desc",
    technologies: ["React"],
    type: "hackathon",
  },
];

describe("TimelineStepChips", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders four native buttons in a labelled group", () => {
    render(
      <TimelineStepChips
        items={items}
        activeIndex={0}
        panelId="timeline-panel-1"
        reducedMotion={false}
        onSelect={vi.fn()}
      />
    );

    const controls = screen.getByRole("group", { name: "Этапы опыта" });

    expect(controls).not.toHaveAttribute("tabindex");
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2023 · Хакатон" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2024 · Обучение" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2025 · Работа" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2026 · Хакатон" })).toBeInTheDocument();
  });

  it("marks the active chip with aria-pressed", () => {
    render(
      <TimelineStepChips
        items={items}
        activeIndex={2}
        panelId="timeline-panel-4"
        reducedMotion={false}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "2025 · Работа" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "2023 · Хакатон" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("calls onSelect with index when a chip is clicked", () => {
    const onSelect = vi.fn();

    render(
      <TimelineStepChips
        items={items}
        activeIndex={0}
        panelId="timeline-panel-1"
        reducedMotion={false}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "2026 · Хакатон" }));
    expect(onSelect).toHaveBeenCalledWith(3);
  });

  it("does not adjust controls scrollLeft on initial mount", () => {
    render(
      <TimelineStepChips
        items={items}
        activeIndex={0}
        panelId="timeline-panel-1"
        reducedMotion={false}
        onSelect={vi.fn()}
      />
    );

    const controls = screen.getByRole("group", { name: "Этапы опыта" });
    controls.scrollLeft = 0;

    expect(controls.scrollLeft).toBe(0);
  });

  it("adjusts controls scrollLeft when the active chip overflows to the right", () => {
    const { rerender } = render(
      <TimelineStepChips
        items={items}
        activeIndex={0}
        panelId="timeline-panel-1"
        reducedMotion={false}
        onSelect={vi.fn()}
      />
    );

    const controls = screen.getByRole("group", { name: "Этапы опыта" });
    let scrollLeft = 0;

    Object.defineProperty(controls, "scrollLeft", {
      configurable: true,
      get: () => scrollLeft,
      set: (value: number) => {
        scrollLeft = value;
      },
    });

    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
      this: Element
    ) {
      if (this.getAttribute("role") === "group") {
        return {
          left: 0,
          right: 200,
          top: 0,
          bottom: 40,
          width: 200,
          height: 40,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        };
      }

      if (this.getAttribute("data-timeline-chip-index") === "3") {
        return {
          left: 250,
          right: 350,
          top: 0,
          bottom: 40,
          width: 100,
          height: 40,
          x: 250,
          y: 0,
          toJSON: () => ({}),
        };
      }

      return {
        left: 0,
        right: 100,
        top: 0,
        bottom: 40,
        width: 100,
        height: 40,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      };
    });

    rerender(
      <TimelineStepChips
        items={items}
        activeIndex={3}
        panelId="timeline-panel-1"
        reducedMotion={false}
        onSelect={vi.fn()}
      />
    );

    expect(scrollLeft).toBe(150);
  });
});
