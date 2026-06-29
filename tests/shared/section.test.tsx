import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Section, SectionHeader } from "@/shared/ui";

describe("Section", () => {
  it("renders section with id and default spacing py-24", () => {
    const { container } = render(
      <Section id="about">
        <p>Content</p>
      </Section>
    );

    const section = container.querySelector("section#about");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("py-24");
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies compact spacing py-16", () => {
    const { container } = render(
      <Section id="skills" spacing="compact">
        <p>Skills</p>
      </Section>
    );

    expect(container.querySelector("section#skills")).toHaveClass("py-16");
  });

  it("applies container-x and container-max on inner wrapper", () => {
    const { container } = render(
      <Section id="projects">
        <p>Projects</p>
      </Section>
    );

    const inner = container.querySelector("section#projects > div");
    expect(inner).toHaveClass("px-6", "lg:px-8", "max-w-6xl", "mx-auto");
  });

  it("renders as footer when as=footer", () => {
    const { container } = render(
      <Section as="footer" backgroundClassName="bg-background-primary">
        <p>Footer</p>
      </Section>
    );

    expect(container.querySelector("footer")).toBeInTheDocument();
    expect(container.querySelector("section")).not.toBeInTheDocument();
  });
});

describe("SectionHeader", () => {
  it("renders eyebrow, title, optional description", () => {
    render(
      <SectionHeader
        eyebrow="Обо мне"
        title="Заголовок"
        description="Описание секции"
      />
    );

    expect(screen.getByText("Обо мне")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Заголовок" })).toBeInTheDocument();
    expect(screen.getByText("Описание секции")).toBeInTheDocument();
  });

  it("applies header-gap mb-12 lg:mb-16", () => {
    const { container } = render(
      <SectionHeader eyebrow="Проекты" title="Избранные работы" />
    );

    expect(container.querySelector("header")).toHaveClass("mb-12", "lg:mb-16");
  });

  it("centers content when align=center", () => {
    const { container } = render(
      <SectionHeader
        align="center"
        eyebrow="Контакты"
        title="Напишите мне"
        description="Описание"
      />
    );

    const header = container.querySelector("header");
    expect(header).toHaveClass("text-center");

    const description = screen.getByText("Описание");
    expect(description).toHaveClass("mx-auto", "max-w-xl");
  });

  it("renders ReactNode eyebrow for custom badges", () => {
    render(
      <SectionHeader
        eyebrow={<span data-testid="custom-eyebrow">Badge</span>}
        title="Контакты"
      />
    );

    expect(screen.getByTestId("custom-eyebrow")).toBeInTheDocument();
  });
});
