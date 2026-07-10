import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { timelineData } from "@/shared/config/content";
import { TimelineView } from "@/widgets/timeline/ui";

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({ reducedMotion: true, lowPerformance: false }),
}));

describe("TimelineView mobile a11y", () => {
  it("renders native controls before the labelled active panel", () => {
    const { container } = render(<TimelineView />);
    const mobileSection = container.querySelector('[data-testid="timeline-mobile"]');

    expect(mobileSection).toBeTruthy();
    expect(container.querySelector('#experience [style*="linear-gradient(to right"]')).toBeNull();

    const controls = mobileSection?.querySelector('[role="group"][aria-label="Этапы опыта"]');
    const activePanel = mobileSection?.querySelector(
      '[role="group"][aria-roledescription="этап карьеры"]'
    );

    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(controls).toBeTruthy();
    expect(activePanel).toHaveAttribute("aria-label", `1 из ${String(timelineData.length)}`);

    const controlsIndex = Array.from(mobileSection?.children ?? []).findIndex((child) =>
      child.contains(controls ?? null)
    );
    const activePanelIndex = Array.from(mobileSection?.children ?? []).findIndex((child) =>
      child.contains(activePanel ?? null)
    );

    expect(controlsIndex).toBeGreaterThanOrEqual(0);
    expect(activePanelIndex).toBeGreaterThan(controlsIndex);
  });

  it("marks inactive slides with inert", () => {
    render(<TimelineView />);

    const activePanel = screen.getByRole("group", {
      name: `1 из ${String(timelineData.length)}`,
    });
    const slides = activePanel.querySelectorAll(":scope > div");
    const inactiveSlides = Array.from(slides).filter(
      (slide) => slide.getAttribute("aria-hidden") === "true"
    );

    expect(inactiveSlides.length).toBeGreaterThan(0);
    for (const slide of inactiveSlides) {
      expect(slide).toHaveAttribute("inert");
    }
  });

  it("updates keyboard focus, panel label, and live counter together", () => {
    render(<TimelineView />);
    const chips = screen.getAllByRole("button", { name: /\d{4} · / });
    const firstChip = chips[0];
    const secondChip = chips[1];

    firstChip.focus();
    fireEvent.keyDown(firstChip, { key: "ArrowRight" });

    expect(secondChip).toHaveFocus();
    expect(
      screen.getByRole("group", { name: `2 из ${String(timelineData.length)}` })
    ).toBeInTheDocument();
    expect(screen.getByText(`2 / ${String(timelineData.length)}`)).toBeInTheDocument();
  });
});
