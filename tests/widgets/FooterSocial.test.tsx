import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FooterWidget } from "@/widgets/footer";

describe("FooterWidget", () => {
  it("renders title and year only, without in-page nav", () => {
    render(<FooterWidget />);

    const footer = screen.getByRole("contentinfo");
    expect(footer.textContent).toContain("Kotikov");
    expect(footer.textContent).toContain("2026");
    expect(footer).toHaveClass("bg-primary-500", "text-[#111]");
    expect(within(footer).queryByText("Быстрые ссылки")).not.toBeInTheDocument();
  });
});
