import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { TimelineItem } from "@/entities/timeline";
import TimelineStepChips from "@/widgets/timeline/ui/TimelineStepChips";

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
  it("renders four chips with year and type labels", () => {
    render(
      <TimelineStepChips
        items={items}
        activeIndex={0}
        panelId="timeline-panel-1"
        reducedMotion={false}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "2023 · Хакатон" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "2024 · Обучение" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "2025 · Работа" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "2026 · Хакатон" })).toBeInTheDocument();
  });

  it("marks the active chip with aria-selected", () => {
    render(
      <TimelineStepChips
        items={items}
        activeIndex={2}
        panelId="timeline-panel-4"
        reducedMotion={false}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByRole("tab", { name: "2025 · Работа" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: "2023 · Хакатон" })).toHaveAttribute(
      "aria-selected",
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

    fireEvent.click(screen.getByRole("tab", { name: "2026 · Хакатон" }));
    expect(onSelect).toHaveBeenCalledWith(3);
  });

  it("does not scroll the page on initial mount", () => {
    const scrollIntoView = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoView;

    render(
      <TimelineStepChips
        items={items}
        activeIndex={0}
        panelId="timeline-panel-1"
        reducedMotion={false}
        onSelect={vi.fn()}
      />
    );

    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
