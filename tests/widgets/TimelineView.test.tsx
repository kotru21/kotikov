import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TimelineView } from "@/widgets/timeline/ui";

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({ reducedMotion: true, lowPerformance: false }),
}));

describe("TimelineView mobile a11y", () => {
  it("renders tablist before tabpanel in DOM order", () => {
    const { container } = render(<TimelineView />);
    const mobileSection = container.querySelector(".lg\\:hidden");

    expect(mobileSection).toBeTruthy();

    const tablist = mobileSection?.querySelector('[role="tablist"]');
    const tabpanel = mobileSection?.querySelector('[role="tabpanel"]');

    expect(tablist).toBeTruthy();
    expect(tabpanel).toBeTruthy();

    const tablistIndex = Array.from(mobileSection?.children ?? []).findIndex((child) =>
      child.contains(tablist ?? null)
    );
    const tabpanelIndex = Array.from(mobileSection?.children ?? []).findIndex((child) =>
      child.contains(tabpanel ?? null)
    );

    expect(tablistIndex).toBeGreaterThanOrEqual(0);
    expect(tabpanelIndex).toBeGreaterThan(tablistIndex);
  });

  it("marks inactive slides with inert", () => {
    render(<TimelineView />);

    const tabpanel = screen.getByRole("tabpanel");
    const slides = tabpanel.querySelectorAll(":scope > div");
    const inactiveSlides = Array.from(slides).filter(
      (slide) => slide.getAttribute("aria-hidden") === "true"
    );

    expect(inactiveSlides.length).toBeGreaterThan(0);
    for (const slide of inactiveSlides) {
      expect(slide).toHaveAttribute("inert");
    }
  });
});
