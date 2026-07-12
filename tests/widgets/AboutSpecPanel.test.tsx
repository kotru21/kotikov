import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { aboutContent } from "@/shared/config/content";
import { AboutWidget } from "@/widgets/about";
import { AboutSpecPanel } from "@/widgets/about/ui";

describe("AboutSpecPanel", () => {
  it("exposes body and all principles in sr-only figcaption matching content config", () => {
    const { container } = render(<AboutSpecPanel />);
    const caption = container.querySelector("figcaption");

    expect(caption).toHaveClass("sr-only");
    expect(caption?.textContent).toContain(aboutContent.body);
    for (const principle of aboutContent.principles) {
      expect(caption?.textContent).toContain(principle);
    }
    expect(caption?.textContent).toContain("Принципы:");
  });

  it("keeps principles out of the visible decorative code panel", () => {
    const { container } = render(<AboutSpecPanel />);

    expect(container.querySelector('[role="tablist"]')).toBeNull();
    expect(container.querySelector('[role="tab"]')).toBeNull();

    const code = container.querySelector("pre code");
    expect(code?.textContent).toContain(aboutContent.spec.exportName);
    expect(code?.textContent).not.toContain("// principles");
    expect(code?.textContent).not.toContain("> feat:");
    for (const principle of aboutContent.principles) {
      expect(code?.textContent).not.toContain(principle);
    }
  });

  it("marks the decorative panel aria-hidden and renders every spec field", () => {
    const { container } = render(<AboutSpecPanel />);
    const decorative = container.querySelector("figure > div[aria-hidden='true']");

    expect(decorative).not.toBeNull();
    expect(decorative?.textContent).toContain(aboutContent.spec.fileName);

    const code = container.querySelector("pre code");
    for (const field of aboutContent.spec.fields) {
      expect(code?.textContent).toContain(field.key);
      expect(code?.textContent).toContain(field.value);
    }
  });
});

describe("AboutWidget", () => {
  it("wires section id, eyebrow, and titled heading", () => {
    const { container } = render(<AboutWidget />);

    expect(container.querySelector("section#about")).not.toBeNull();
    expect(screen.getByText("Обо мне")).toBeInTheDocument();
    const heading = screen.getByRole("heading", { name: aboutContent.title });
    expect(heading).toHaveAttribute("id", "about-heading");
  });
});
