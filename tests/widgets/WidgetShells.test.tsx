import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { footerInfo, footerSocialLinks, navigation } from "@/shared/config/content";
import { FooterWidget } from "@/widgets/footer";
import { FooterBottom, FooterInfo, FooterNavigation } from "@/widgets/footer/ui";
import TimelineWidget from "@/widgets/timeline/TimelineWidget";

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({ reducedMotion: true, lowPerformance: false }),
}));

describe("Footer chrome", () => {
  it("renders FooterWidget landmark with info, nav, social, and copyright", () => {
    render(<FooterWidget />);

    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByRole("heading", { name: footerInfo.title })).toBeInTheDocument();
    expect(within(footer).getByRole("heading", { name: footerInfo.navTitle })).toBeInTheDocument();
    expect(within(footer).getByRole("heading", { name: footerInfo.socialTitle })).toBeInTheDocument();
    expect(
      within(footer).getByText(`© ${String(footerInfo.copyrightYear)} ${footerInfo.title}.`)
    ).toBeInTheDocument();

    expect(within(footer).getByRole("link", { name: navigation[0].name })).toHaveAttribute(
      "href",
      navigation[0].href
    );

    const github = within(footer).getByRole("link", {
      name: "GitHub (откроется в новой вкладке)",
    });
    expect(github).toHaveAttribute("href", footerSocialLinks[0].url);
    expect(github).toHaveAttribute("title", "GitHub (откроется в новой вкладке)");

    expect(
      within(footer).getByRole("link", { name: "Написать по электронной почте" })
    ).toHaveAttribute("href", footerSocialLinks[3].url);
  });

  it("renders FooterBottom with brand, reduced-motion heart, Info, and Navigation", () => {
    const { container } = render(<FooterBottom year={2026} brand={footerInfo.title} />);
    expect(screen.getByText(`© 2026 ${footerInfo.title}.`)).toBeInTheDocument();
    expect(container.querySelector("svg")?.getAttribute("class") ?? "").toContain(
      "motion-reduce:animate-none"
    );

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
