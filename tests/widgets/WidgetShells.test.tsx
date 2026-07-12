import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { footerInfo, navigation } from "@/shared/config/content";
import FooterWidget from "@/widgets/footer/FooterWidget";
import { FooterBottom, FooterInfo, FooterNavigation } from "@/widgets/footer/ui";
import TimelineWidget from "@/widgets/timeline/TimelineWidget";

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({ reducedMotion: true, lowPerformance: false }),
}));

describe("Footer chrome", () => {
  it("renders FooterWidget with info, navigation, and copyright", () => {
    render(<FooterWidget />);
    expect(screen.getByRole("heading", { name: footerInfo.title })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });

  it("renders FooterBottom, FooterInfo, and FooterNavigation", () => {
    render(<FooterBottom year={2026} />);
    expect(screen.getByText(/© 2026 Kotikov/)).toBeInTheDocument();

    render(<FooterInfo title="Title" description="Description copy" />);
    expect(screen.getByRole("heading", { name: "Title" })).toBeInTheDocument();
    expect(screen.getByText("Description copy")).toBeInTheDocument();

    render(<FooterNavigation title="Links" links={navigation} />);
    expect(screen.getByRole("heading", { name: "Links" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: navigation[0].name })).toHaveAttribute(
      "href",
      navigation[0].href
    );
  });
});

describe("TimelineWidget", () => {
  it("renders the experience section", () => {
    const { container } = render(<TimelineWidget />);
    expect(container.querySelector("#experience")).toBeTruthy();
  });
});
