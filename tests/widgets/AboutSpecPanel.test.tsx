import { render } from "@testing-library/react";
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
  });

  it("renders a single code panel without tabs or principles lines", () => {
    const { container } = render(<AboutSpecPanel />);

    expect(container.querySelector('[role="tablist"]')).toBeNull();
    expect(container.querySelector('[role="tab"]')).toBeNull();

    const code = container.querySelector("pre code");
    expect(code?.textContent).toContain(aboutContent.spec.exportName);
    expect(code?.textContent).not.toContain("// principles");
    expect(code?.textContent).not.toContain("> feat:");
    expect(code?.textContent).not.toContain(aboutContent.principles[0]);
  });
});
