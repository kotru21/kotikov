import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { KMark } from "@/shared/ui";

describe("KMark", () => {
  it("renders the geometric K as currentColor svg", () => {
    const { container } = render(<KMark className="w-8" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg?.querySelector("rect")).toHaveAttribute("fill", "currentColor");
  });
});
