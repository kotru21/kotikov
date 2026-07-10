import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ClearPaintButton } from "@/features/paw";

describe("ClearPaintButton", () => {
  it("renders with data-draw-allow and handles click", () => {
    const onClick = vi.fn();

    render(<ClearPaintButton onClick={onClick} tone="on-gradient" />);

    const button = screen.getByRole("button", { name: "Очистить рисунок" });
    expect(button).toHaveAttribute("data-draw-allow");
    expect(button.className).toMatch(/bg-black/);
    expect(button.className).not.toMatch(/bg-white\/10/);

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
