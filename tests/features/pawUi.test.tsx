import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ClearPaintButton, PaintDrawHint } from "@/features/paw";

vi.mock("@/features/device", () => ({
  useIsMobile: () => false,
}));

vi.mock("@/features/interactive-elements", () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention -- mock mirrors real PascalCase exports
  InteractiveElement: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
  } & Record<string, unknown>) => <p {...props}>{children}</p>,
  // eslint-disable-next-line @typescript-eslint/naming-convention -- mock mirrors real PascalCase exports
  InteractiveText: ({ text }: { text: string }) => text,
}));

describe("ClearPaintButton", () => {
  it("renders with data-draw-allow and handles click", () => {
    const onClick = vi.fn();

    render(<ClearPaintButton onClick={onClick} tone="on-gradient" />);

    const button = screen.getByRole("button", { name: "Очистить рисунок" });
    expect(button).toHaveAttribute("data-draw-allow");
    expect(button.className).toMatch(/bg-black/);
    expect(button.className).not.toMatch(/bg-white\/10/);
    expect(button.className).toMatch(/min-h-11/);

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("PaintDrawHint", () => {
  it("explains desktop paint interaction", () => {
    render(<PaintDrawHint tone="on-gradient" />);

    expect(screen.getByText(/проведи мышью/i)).toBeInTheDocument();
  });
});
