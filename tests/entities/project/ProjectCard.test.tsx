import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectCard } from "@/entities/project";
import { projectsData } from "@/shared/config/content";

describe("ProjectCard", () => {
  const project = projectsData[0];

  it("renders title, summary and code link", () => {
    const { container } = render(<ProjectCard project={project} />);
    const card = container.querySelector("article");

    expect(card).toHaveClass("border-0");
    expect(card?.className).not.toContain("border-2");
    expect(screen.getByRole("heading", { name: project.title })).toBeInTheDocument();
    expect(screen.getByText(project.summary)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Код (откроется в новой вкладке)" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /подробнее/i })).not.toBeInTheDocument();
  });

  it("uses Russian accessible names for external project links", () => {
    render(<ProjectCard project={{ ...project, liveUrl: "https://example.com" }} />);

    expect(
      screen.getByRole("link", { name: "Код (откроется в новой вкладке)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Демо (откроется в новой вкладке)" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Live")).not.toBeInTheDocument();
  });

  it("does not render a decorative background pattern", () => {
    const { container } = render(<ProjectCard project={project} featured />);
    const card = container.querySelector("article");

    expect(card?.querySelector(".pointer-events-none")).toBeNull();
    expect(card?.className).not.toMatch(/overflow-hidden/);
  });

  it("stacks below md and uses a short horizontal layout from md when wideOnTablet", () => {
    const { container } = render(<ProjectCard project={project} wideOnTablet />);

    const card = container.querySelector("article");
    expect(card?.className).toMatch(/h-full/);
    expect(card?.className).toMatch(/min-h-0/);
    expect(card?.className).toMatch(/min-w-0/);
    expect(card?.className).toMatch(/flex-col/);
    expect(card?.className).toMatch(/md:flex-row/);
    expect(card?.className).toMatch(/xl:flex-col/);
    expect(card?.className).not.toMatch(/min-h-88/);
    expect(card?.className).not.toMatch(/writing-mode/);
  });

  it("keeps the featured banner teal, stacked below md, horizontal from md", () => {
    const { container } = render(<ProjectCard project={project} featured />);

    const card = container.querySelector("article");
    expect(card?.className).toMatch(/h-full/);
    expect(card?.className).toMatch(/min-h-0/);
    expect(card?.className).toMatch(/min-w-0/);
    expect(card?.className).toMatch(/flex-col/);
    expect(card?.className).toMatch(/md:flex-row/);
    expect(card?.className).not.toMatch(/xl:flex-col/);
    expect(card?.className).not.toMatch(/writing-mode/);
    expect(card).toHaveClass("bg-primary-500", "text-[#111]");
  });
});
