import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Logo } from "@/shared/ui";

describe("Logo", () => {
  it("renders decorative SVG with aria-hidden for both variants", () => {
    const { rerender, container } = render(<Logo variant="pc" />);
    const pc = container.querySelector("svg");
    expect(pc).toHaveAttribute("aria-hidden", "true");

    rerender(<Logo variant="mobile" />);
    const mobile = container.querySelector("svg");
    expect(mobile).toHaveAttribute("aria-hidden", "true");
  });
});
