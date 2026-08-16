import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FooterWidget } from "@/widgets/footer";
import TimelineWidget from "@/widgets/timeline/TimelineWidget";

vi.mock("@/features/performance/client", () => ({
  usePerformanceSettings: () => ({ reducedMotion: true, lowPerformance: false }),
}));

describe("Footer chrome", () => {
  it("renders a thin contentinfo band with Kotikov and year, without quick links", () => {
    render(<FooterWidget />);

    const footer = screen.getByRole("contentinfo");
    expect(footer.textContent).toContain("Kotikov");
    expect(footer.textContent).toContain("2026");
    expect(footer).toHaveClass("bg-primary-500", "text-[#111]");
    expect(within(footer).queryByText("Быстрые ссылки")).not.toBeInTheDocument();
  });
});

describe("TimelineWidget", () => {
  it("renders the experience section", () => {
    const { container } = render(<TimelineWidget />);
    expect(container.querySelector("#experience")).toBeTruthy();
  });
});
