import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { aboutContent } from "@/shared/config/content";
import { AboutSpecPanel } from "@/widgets/about/ui";

describe("AboutSpecPanel", () => {
  it("exposes body and principles in sr-only figcaption", () => {
    const { container } = render(<AboutSpecPanel />);
    const caption = container.querySelector("figcaption");

    expect(caption).toHaveClass("sr-only");
    expect(caption?.textContent).toContain(aboutContent.body.slice(0, 24));
    expect(caption?.textContent).toContain(aboutContent.principles[0]);
    expect(caption?.textContent).not.toMatch(/\b(feat|a11y|perf)\b/);
  });

  it("keeps Spec code free of principles lines", () => {
    const { container } = render(<AboutSpecPanel />);
    const specPanel = container.querySelector('[id$="-spec-panel"]');

    expect(specPanel?.textContent).toContain(aboutContent.spec.exportName);
    expect(specPanel?.textContent).not.toContain("// principles");
    expect(specPanel?.textContent).not.toContain("> feat:");
    expect(specPanel?.textContent).not.toContain(aboutContent.principles[0]);
  });

  it("stacks both tab panels in one grid cell so height stays reserved", () => {
    const { container } = render(<AboutSpecPanel />);
    const stack = container.querySelector("[data-about-tab-stack]");
    const specPanel = container.querySelector('[id$="-spec-panel"]');
    const principlesPanel = container.querySelector('[id$="-principles-panel"]');

    expect(stack).toHaveClass("grid");
    expect(specPanel).toHaveClass("col-start-1", "row-start-1", "visible");
    expect(principlesPanel).toHaveClass("col-start-1", "row-start-1", "invisible");
    expect(specPanel).not.toHaveAttribute("hidden");
    expect(principlesPanel).not.toHaveAttribute("hidden");
  });

  it("switches to Принципы with plain lines without changing stack height", async () => {
    const user = userEvent.setup();
    const { container } = render(<AboutSpecPanel />);
    const stack = container.querySelector("[data-about-tab-stack]") as HTMLElement | null;
    const heightBefore = stack?.offsetHeight ?? 0;

    await user.click(screen.getByRole("tab", { name: "Принципы" }));

    expect(screen.getByRole("tab", { name: "Принципы" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Spec" })).toHaveAttribute("aria-selected", "false");

    const specPanel = container.querySelector('[id$="-spec-panel"]');
    const principlesPanel = container.querySelector('[id$="-principles-panel"]');

    expect(specPanel).toHaveClass("invisible");
    expect(principlesPanel).toHaveClass("visible");
    expect(principlesPanel?.textContent).not.toMatch(/\b(feat|a11y|perf)\b/);

    for (const line of aboutContent.principles) {
      expect(principlesPanel?.textContent).toContain(line);
    }

    expect(stack?.offsetHeight ?? 0).toBe(heightBefore);
  });
});
