import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkipLinks } from "@/app/components/SkipLinks";

describe("SkipLinks", () => {
  it("renders two focus-revealed links in navigation order", () => {
    render(<SkipLinks />);

    const navigation = screen.getByRole("navigation", { name: "Быстрый переход" });
    const links = within(navigation).getAllByRole("link");
    const mainLink = within(navigation).getByRole("link", { name: "К основному содержимому" });
    const projectsLink = within(navigation).getByRole("link", { name: "К проектам" });

    expect(links).toEqual([mainLink, projectsLink]);
    expect(mainLink).toHaveAttribute("href", "#main-content");
    expect(mainLink).toHaveClass("focus:not-sr-only", "focus:top-4", "focus:left-4");
    expect(projectsLink).toHaveAttribute("href", "#projects");
    expect(projectsLink).toHaveClass("focus:not-sr-only", "focus:top-16", "focus:left-4");
  });

  it("is composed on the home page where skip targets exist", async () => {
    const { readFile } = await import("node:fs/promises");
    const page = await readFile("app/page.tsx", "utf8");
    const layout = await readFile("app/layout.tsx", "utf8");
    expect(page).toContain("SkipLinks");
    expect(layout).not.toContain("SkipLinks");
  });
});
