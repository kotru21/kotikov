import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { InteractiveTextContext, useInteractiveRegistry } from "@/features/interactive-elements";
import ClearPaintButton from "@/features/paw/ui/ClearPaintButton";
import PaintDrawHint from "@/features/paw/ui/PaintDrawHint";

vi.mock("@/features/device", () => ({
  useIsMobile: (): boolean => false,
}));

function PaintDrawHintHarness(): React.JSX.Element {
  const { registry } = useInteractiveRegistry();

  return (
    <InteractiveTextContext value={registry}>
      <PaintDrawHint tone="on-gradient" />
    </InteractiveTextContext>
  );
}

describe("PaintDrawHint", () => {
  it("renders desktop hint with interactive paint attributes", () => {
    const { container } = render(<PaintDrawHintHarness />);

    const root = container.querySelector("p[data-draw-allow]");

    expect(root).toBeTruthy();
    expect(root).toHaveAttribute("data-interactive-mode", "solid");
    expect(root).toHaveAttribute("data-interactive-threshold", "0.08");
    expect(root?.textContent).toMatch(/Проведи\s+мышью/);
    expect(root?.textContent).toMatch(/оставь\s+след\s+лапы/);
  });
});

describe("ClearPaintButton", () => {
  it("renders with data-draw-allow and handles click", () => {
    const onClick = vi.fn();

    render(<ClearPaintButton onClick={onClick} tone="on-gradient" />);

    const button = screen.getByRole("button", { name: "Очистить рисунок" });
    expect(button).toHaveAttribute("data-draw-allow");

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
