import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ClearPaintButton, PaintDrawHint, usePawAnimation } from "@/features/paw";

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

describe("usePawAnimation", () => {
  it("keeps drawing disabled when enabled is false", () => {
    const onDraw = vi.fn();
    const { result } = renderHook(() => usePawAnimation(onDraw, { enabled: false }));

    const target = document.createElement("div");
    document.body.appendChild(target);

    act(() => {
      result.current.handlers.handlePointerEnter({
        pointerType: "mouse",
        target,
        clientX: 10,
        clientY: 20,
        currentTarget: target,
      } as unknown as React.PointerEvent<HTMLElement>);
    });

    expect(result.current.isDrawing).toBe(false);
    expect(onDraw).not.toHaveBeenCalled();
  });

  it("starts mouse drawing on pointer enter when enabled", () => {
    const onDraw = vi.fn();
    const { result } = renderHook(() => usePawAnimation(onDraw, { enabled: true }));

    const target = document.createElement("div");
    document.body.appendChild(target);

    act(() => {
      result.current.handlers.handlePointerEnter({
        pointerType: "mouse",
        target,
        clientX: 10,
        clientY: 20,
        currentTarget: target,
      } as unknown as React.PointerEvent<HTMLElement>);
    });

    expect(result.current.isDrawing).toBe(true);
  });

  it("requires pointer down for touch drawing", () => {
    const onDraw = vi.fn();
    const { result } = renderHook(() => usePawAnimation(onDraw));

    const target = document.createElement("div");
    Object.defineProperty(target, "setPointerCapture", { value: vi.fn() });
    Object.defineProperty(target, "releasePointerCapture", { value: vi.fn() });
    document.body.appendChild(target);

    act(() => {
      result.current.handlers.handlePointerMove({
        pointerType: "touch",
        target,
        clientX: 5,
        clientY: 5,
        currentTarget: target,
      } as unknown as React.PointerEvent<HTMLElement>);
    });
    expect(result.current.isDrawing).toBe(false);

    act(() => {
      result.current.handlers.handlePointerDown({
        pointerType: "touch",
        pointerId: 1,
        target,
        clientX: 5,
        clientY: 5,
        currentTarget: target,
        preventDefault: vi.fn(),
      } as unknown as React.PointerEvent<HTMLElement>);
    });
    expect(result.current.isDrawing).toBe(true);
  });
});
