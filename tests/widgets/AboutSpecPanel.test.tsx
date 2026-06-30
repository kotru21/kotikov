import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { aboutContent } from "@/shared/config/content";
import AboutSpecPanel from "@/widgets/about/ui/AboutSpecPanel";

describe("AboutSpecPanel", () => {
  it("exposes body and principles in sr-only figcaption", () => {
    const { container } = render(<AboutSpecPanel />);
    const caption = container.querySelector("figcaption");

    expect(caption).toHaveClass("sr-only");
    expect(caption?.textContent).toContain(aboutContent.body.slice(0, 24));
    expect(caption?.textContent).toContain("feat:");
    expect(caption?.textContent).toContain(aboutContent.principles[0].text);
  });

  it("renders decorative code block as aria-hidden", () => {
    const { container } = render(<AboutSpecPanel />);
    const codeBlock = container.querySelector("[aria-hidden='true']");

    expect(codeBlock).toBeTruthy();
    expect(codeBlock?.textContent).toContain(aboutContent.spec.exportName);
  });
});
