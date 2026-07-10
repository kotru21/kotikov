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
    expect(caption?.textContent).toContain("feat:");
    expect(caption?.textContent).toContain(aboutContent.principles[0].text);
  });

  it("renders Spec code without principles commit lines", () => {
    const { container } = render(<AboutSpecPanel />);
    const specPanel = container.querySelector('[id$="-spec-panel"]');

    expect(specPanel?.getAttribute("aria-hidden")).toBe("true");
    expect(specPanel?.textContent).toContain(aboutContent.spec.exportName);
    expect(specPanel?.textContent).not.toContain("// principles");
    expect(specPanel?.textContent).not.toContain("> feat:");
    expect(specPanel?.textContent).not.toContain(aboutContent.principles[0].text);
  });

  it("switches to Принципы tab with tagged list", async () => {
    const user = userEvent.setup();
    const { container } = render(<AboutSpecPanel />);

    await user.click(screen.getByRole("tab", { name: "Принципы" }));

    expect(screen.getByRole("tab", { name: "Принципы" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Spec" })).toHaveAttribute("aria-selected", "false");

    const principlesPanel = container.querySelector('[id$="-principles-panel"]');
    expect(principlesPanel).not.toBeNull();
    expect(principlesPanel).not.toHaveAttribute("hidden");

    for (const principle of aboutContent.principles) {
      expect(principlesPanel?.textContent).toContain(principle.type);
      expect(principlesPanel?.textContent).toContain(principle.text);
    }
  });
});
