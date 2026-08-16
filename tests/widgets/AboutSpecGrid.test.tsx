import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ThemeProvider } from "@/features/theme/client";
import { aboutContent, social } from "@/shared/config/content";
import { AboutWidget } from "@/widgets/about";
import { AboutSpecGrid } from "@/widgets/about/ui";

function renderAboutWidget(): ReturnType<typeof render> {
  return render(
    <ThemeProvider>
      <AboutWidget />
    </ThemeProvider>
  );
}

vi.stubGlobal(
  "matchMedia",
  (query: string) =>
    ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    }) satisfies MediaQueryList
);

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly scrollMargin = "0px";
  readonly thresholds = [0];
  readonly disconnect = vi.fn();
  readonly observe = vi.fn();
  readonly takeRecords = vi.fn((): IntersectionObserverEntry[] => []);
  readonly unobserve = vi.fn();
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

describe("AboutSpecGrid", () => {
  it("renders every spec field as a visible key/value cell", () => {
    render(<AboutSpecGrid />);

    for (const field of aboutContent.spec.fields) {
      expect(screen.getByText(field.key)).toBeInTheDocument();
      expect(screen.getByText(field.value)).toBeInTheDocument();
    }
  });

  it("does not render a decorative pre code panel", () => {
    const { container } = render(<AboutSpecGrid />);

    expect(container.querySelector("pre code")).toBeNull();
  });

  it("keeps principles in sr-only copy", () => {
    const { container } = render(<AboutSpecGrid />);
    const srOnly = container.querySelector(".sr-only");

    expect(srOnly).not.toBeNull();
    for (const principle of aboutContent.principles) {
      expect(srOnly?.textContent).toContain(principle);
    }
  });

  it("stretches equal rows so spec cells fill the column", () => {
    const { container } = render(<AboutSpecGrid />);
    const root = container.firstElementChild;

    expect(root).toHaveClass("h-full", "min-h-0", "min-w-0");
    const rows = container.querySelector(".grid-rows-3");
    expect(rows).toHaveClass("h-full", "min-h-0", "min-w-0", "grid-cols-2");
    const cell = rows?.firstElementChild;
    expect(cell).toHaveClass("h-full", "min-h-0", "min-w-0");
  });

  it("lets spec cells meet by fill without internal ink gaps", () => {
    const { container } = render(<AboutSpecGrid />);
    const rows = container.querySelector(".grid-rows-3");
    const cells = [...container.querySelectorAll(".grid-rows-3 > div")];

    expect(rows).not.toHaveClass("gap-[2px]");
    expect(rows).not.toHaveClass("bg-[#111]");
    expect(cells).toHaveLength(aboutContent.spec.fields.length);
    expect(cells.every((cell) => cell.classList.contains("border-0"))).toBe(true);
    expect(cells.every((cell) => cell.classList.contains("min-w-0"))).toBe(true);
    expect(cells.every((cell) => !cell.classList.contains("border-2"))).toBe(true);
  });

  it("wraps long spec values instead of overflowing the cell", () => {
    const { container } = render(<AboutSpecGrid />);
    const values = [...container.querySelectorAll(".grid-rows-3 > div > p:last-of-type")];

    expect(values).toHaveLength(aboutContent.spec.fields.length);
    expect(values.every((value) => value.classList.contains("break-words"))).toBe(true);
    expect(values.every((value) => value.classList.contains("min-w-0"))).toBe(true);
  });

  it("keeps alternating teal and paper cells without interactive word targets", () => {
    const { container } = render(<AboutSpecGrid />);
    const cells = container.querySelectorAll(".grid-rows-3 > div");

    expect(cells).toHaveLength(aboutContent.spec.fields.length);
    expect(cells[0]).toHaveClass("bg-primary-500", "text-[#111]");
    expect(cells[1].className).toMatch(/bg-background-primary/);
    expect(container.querySelector(".grid-rows-3 [aria-hidden='true']")).toBeNull();
  });
});

describe("AboutWidget", () => {
  it("exposes section #about and heading id about-heading", () => {
    const { container } = renderAboutWidget();

    expect(container.querySelector("section#about")).not.toBeNull();
    const heading = screen.getByRole("heading", { name: aboutContent.title });
    expect(heading).toHaveAttribute("id", "about-heading");
    expect(heading).not.toHaveClass("sr-only", "max-md:sr-only");
  });

  it("shows body and spec fields without a pre code panel", () => {
    const { container } = renderAboutWidget();

    expect(screen.getByText(aboutContent.body)).toBeInTheDocument();
    expect(container.querySelector("pre code")).toBeNull();
    for (const field of aboutContent.spec.fields) {
      expect(screen.getByText(field.key)).toBeInTheDocument();
      expect(screen.getByText(field.value)).toBeInTheDocument();
    }
  });

  it("registers heading and body with InteractiveText for paint contrast", () => {
    renderAboutWidget();

    const heading = screen.getByRole("heading", { name: aboutContent.title });
    const headingSr = heading.querySelector(".sr-only");
    expect(headingSr).toHaveTextContent(aboutContent.title);
    expect(heading.querySelector("[aria-hidden='true']")).not.toBeNull();
    expect(heading.querySelectorAll("[aria-hidden='true'] .inline-block").length).toBeGreaterThan(
      0
    );

    const bodySr = screen.getByText(aboutContent.body);
    expect(bodySr).toHaveClass("sr-only");
    expect(bodySr.nextElementSibling).toHaveAttribute("aria-hidden", "true");
  });

  it("stretches both about columns to the same height", () => {
    const { container } = renderAboutWidget();
    const columns = container.querySelector("section#about .grid.items-stretch");

    expect(columns).toBeInstanceOf(HTMLElement);
    expect(columns).toHaveClass("md:grid-cols-2", "divide-y-2", "md:divide-x-2", "md:divide-y-0");
    expect(columns?.children[0]).toHaveClass("h-full", "min-h-0", "min-w-0");
    expect(columns?.children[0]).not.toHaveClass("border-2");
    expect(columns?.children[0]).not.toHaveClass("border-x-2");
    expect(columns?.children[1]).toHaveClass("h-full", "min-h-0", "min-w-0");
    expect(container.querySelector("section#about")).not.toHaveClass("border-2");
  });

  it("puts a LinkedIn link under the left copy, not in the spec grid", () => {
    const { container } = renderAboutWidget();
    const columns = container.querySelector("section#about .grid.items-stretch");
    const link = screen.getByRole("link", { name: "LinkedIn (откроется в новой вкладке)" });

    expect(columns?.children[0]).toContainElement(link);
    expect(container.querySelector(".grid-rows-3 a")).toBeNull();
    expect(link).toHaveAttribute("href", social.linkedin.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveClass("border-2", "bg-primary-500", "text-[#111]");
  });

  it("does not show a paint interaction hint", () => {
    renderAboutWidget();

    expect(screen.queryByText(/след лапы/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/закрась сетку/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/закрасить сетку/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/проведи мышью/i)).not.toBeInTheDocument();
  });
});
