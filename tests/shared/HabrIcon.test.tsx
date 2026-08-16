import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HabrIcon } from "@/shared/ui";

describe("HabrIcon", () => {
  it("renders the Simple Icons scribble as currentColor", () => {
    const { container } = render(<HabrIcon className="size-8" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveAttribute("fill", "currentColor");
    expect(svg?.querySelector("path")).toHaveAttribute("d");
  });
});
