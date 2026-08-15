/* eslint-disable @typescript-eslint/naming-convention -- vi.mock factory keys must match the PascalCase named widget exports */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Home from "@/app/page";
import { GRID_BAND_STACK, GRID_DIVIDE } from "@/shared/ui";

vi.mock("@/app/components/StructuredData", () => ({ default: () => null }));
vi.mock("@/widgets/puzzle", () => ({ PuzzleHome: () => <header id="header" /> }));
vi.mock("@/widgets/shell", () => ({
  SiteFrame: ({ puzzle, children }: { puzzle: React.ReactNode; children: React.ReactNode }) => (
    <>
      {puzzle}
      {children}
    </>
  ),
}));
vi.mock("@/widgets/about", () => ({ AboutWidget: () => <section id="about" /> }));
vi.mock("@/widgets/projects", () => ({ ProjectsWidget: () => <section id="projects" /> }));
vi.mock("@/widgets/skills", () => ({ SkillsWidget: () => <section id="skills" /> }));
vi.mock("@/widgets/timeline", () => ({ TimelineWidget: () => <section id="experience" /> }));
vi.mock("@/widgets/contacts", () => ({ ContactsWidget: () => <section id="contacts" /> }));
vi.mock("@/widgets/footer", () => ({ FooterWidget: () => <footer id="footer" /> }));

describe("home page composition", () => {
  it("renders sections in the agreed order", () => {
    const { container } = render(<Home />);
    const ids = Array.from(container.querySelectorAll("header, section, footer")).map((n) => n.id);
    expect(ids).toEqual([
      "header",
      "about",
      "projects",
      "skills",
      "experience",
      "contacts",
      "footer",
    ]);
  });

  it("keeps the banner header outside main and targets main for skip links", () => {
    const { container } = render(<Home />);
    const main = container.querySelector("main#main-content");
    const header = container.querySelector("#header");

    expect(main).not.toBeNull();
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(header).not.toBeNull();
    expect(header?.tagName).toBe("HEADER");
    expect(main?.contains(header)).toBe(false);
    expect(main?.querySelector("#about")).not.toBeNull();
    expect(main?.querySelector("#projects")).not.toBeNull();
  });

  it("uses one shared 2px stack stroke instead of a box on every band", () => {
    const { container } = render(<Home />);
    const main = container.querySelector("main#main-content");
    const stack = main?.parentElement;
    const footer = container.querySelector("#footer");

    expect(main).toHaveClass(...GRID_DIVIDE.split(" "));
    expect(stack?.className).toContain(GRID_BAND_STACK);
    expect(stack).toHaveClass("-mt-[2px]", "border-t-2", "max-md:border-b-2", "divide-y-2");
    expect(stack).not.toHaveClass("border-2");
    expect(stack).not.toHaveClass("border-l-2");
    expect(stack).not.toHaveClass("border-r-2");
    expect(stack).not.toHaveClass("border-x-2");
    expect(stack?.contains(footer)).toBe(true);
    expect(main?.contains(footer)).toBe(false);
  });
});
