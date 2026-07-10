import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card } from "@/shared/ui";

describe("Card", () => {
  it("uses hard-shadow-sm token on default variant", () => {
    const { container } = render(<Card>Content</Card>);

    expect(container.firstChild).toHaveClass("shadow-[var(--shadow-hard-sm)]");
  });

  it("uses hard-shadow-lg token on elevated variant", () => {
    const { container } = render(<Card variant="elevated">Elevated</Card>);

    expect(container.firstChild).toHaveClass("shadow-[var(--shadow-hard-lg)]");
  });
});
