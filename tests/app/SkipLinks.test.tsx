import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkipLinks } from "@/app/components/SkipLinks";

describe("SkipLinks", () => {
  it("links to the main content and projects", () => {
    render(<SkipLinks />);

    expect(screen.getByRole("link", { name: "К основному содержимому" })).toHaveAttribute(
      "href",
      "#main-content"
    );
    expect(screen.getByRole("link", { name: "К проектам" })).toHaveAttribute("href", "#projects");
  });
});
