import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/shared/ui";

describe("Button", () => {
  it("uses motion-micro duration token", () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole("button")).toHaveClass("duration-[var(--motion-micro)]");
  });

  it("uses hard-shadow-sm token on primary variant", () => {
    render(<Button variant="primary">Primary</Button>);

    expect(screen.getByRole("button")).toHaveClass("shadow-[var(--shadow-hard-sm)]");
  });
});
