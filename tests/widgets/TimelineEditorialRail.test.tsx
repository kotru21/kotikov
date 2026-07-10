import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { timelineData } from "@/shared/config/content";
import TimelineEditorialRail from "@/widgets/timeline/ui/TimelineEditorialRail";

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({ reducedMotion: true, lowPerformance: false }),
}));

describe("TimelineEditorialRail", () => {
  it("renders cards and navigates with toolbar controls", () => {
    const scrollBy = vi.fn();
    HTMLElement.prototype.scrollBy = scrollBy;

    const { container } = render(<TimelineEditorialRail items={timelineData.slice(0, 3)} />);

    const scroller = screen.getByRole("region", { name: /Лента этапов опыта/i });
    Object.defineProperty(scroller, "scrollWidth", { configurable: true, value: 1200 });
    Object.defineProperty(scroller, "clientWidth", { configurable: true, value: 400 });
    Object.defineProperty(scroller, "scrollLeft", { configurable: true, writable: true, value: 0 });

    fireEvent.scroll(scroller);

    expect(scroller).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Этапы опыта" }).children.length).toBeGreaterThan(1);

    const next = screen.getByRole("button", { name: "Прокрутить к следующему этапу" });
    expect(next).not.toBeDisabled();
    fireEvent.click(next);
    expect(scrollBy).toHaveBeenCalled();

    const toolbar = screen.getByRole("toolbar", { name: "Навигация по ленте этапов" });
    fireEvent.keyDown(toolbar, { key: "ArrowRight" });
    fireEvent.keyDown(toolbar, { key: "ArrowLeft" });
    expect(scrollBy.mock.calls.length).toBeGreaterThanOrEqual(2);

    expect(container.querySelectorAll("[data-timeline-card]").length).toBe(3);
  });
});
