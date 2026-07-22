import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Section, SectionHeader } from "@/shared/ui";

describe("Section", () => {
  it("renders section with id and default standard spacing", () => {
    const { container } = render(
      <Section id="about">
        <p>Content</p>
      </Section>
    );

    const section = container.querySelector("section#about");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("py-[var(--section-space-standard)]");
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies dense spacing via section-space-dense token", () => {
    const { container } = render(
      <Section id="skills" spacing="dense">
        <p>Skills</p>
      </Section>
    );

    expect(container.querySelector("section#skills")).toHaveClass(
      "py-[var(--section-space-dense)]"
    );
  });

  it("applies cta spacing via section-space-cta token", () => {
    const { container } = render(
      <Section id="contacts" spacing="cta">
        <p>Contacts</p>
      </Section>
    );

    expect(container.querySelector("section#contacts")).toHaveClass(
      "py-[var(--section-space-cta)]"
    );
  });

  it("applies footer spacing pt-12 pb-16", () => {
    const { container } = render(
      <Section as="footer" spacing="footer">
        <p>Footer</p>
      </Section>
    );

    expect(container.querySelector("footer")).toHaveClass("pt-12", "pb-16");
  });

  it("omits vertical padding when spacing=none", () => {
    const { container } = render(
      <Section id="footer" spacing="none">
        <p>Footer</p>
      </Section>
    );

    const section = container.querySelector("section#footer");
    expect(section).toBeInTheDocument();
    expect(section).not.toHaveClass("py-[var(--section-space-standard)]");
    expect(section).not.toHaveClass("py-[var(--section-space-dense)]");
  });

  it("applies container-x and container-max on inner wrapper", () => {
    const { container } = render(
      <Section id="projects" tabIndex={-1}>
        <p>Projects</p>
      </Section>
    );

    const section = container.querySelector("section#projects");
    expect(section).toHaveAttribute("tabindex", "-1");
    const inner = container.querySelector("section#projects > div");
    expect(inner).toHaveClass("px-6", "lg:px-8", "max-w-6xl", "mx-auto");
  });

  it("skips horizontal padding and max-width when contained=false", () => {
    const { container } = render(
      <Section id="skills" contained={false}>
        <p>Skills</p>
      </Section>
    );

    const inner = container.querySelector("section#skills > div");
    expect(inner).toHaveClass("w-full", "max-w-none");
    expect(inner).not.toHaveClass("px-6");
    expect(inner).not.toHaveClass("max-w-6xl");
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
    render(<SectionHeader eyebrow="Обо мне" title="Заголовок" description="Описание секции" />);

    expect(screen.getByText("Обо мне")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Заголовок" })).toBeInTheDocument();
    expect(screen.getByText("Описание секции")).toBeInTheDocument();
  });

  it("applies header-gap mb-8 lg:mb-12", () => {
    const { container } = render(<SectionHeader eyebrow="Проекты" title="Избранные работы" />);

    expect(container.querySelector("header")).toHaveClass("mb-8", "lg:mb-12");
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
      <SectionHeader eyebrow={<span data-testid="custom-eyebrow">Badge</span>} title="Контакты" />
    );

    expect(screen.getByTestId("custom-eyebrow")).toBeInTheDocument();
  });

  it("applies H2 typography scale from design spec", () => {
    render(<SectionHeader eyebrow="Test" title="Title" />);
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2).toHaveClass(
      "text-[clamp(2.25rem,5vw,3rem)]",
      "text-balance",
      "font-black",
      "tracking-tight",
      "uppercase"
    );
  });
});
