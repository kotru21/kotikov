import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { usePawAnimation } from "@/features/paw/usePawAnimation";

function PawHost({
  onDraw,
  enabled = true,
}: {
  onDraw: (x: number, y: number, prevX: number, prevY: number) => void;
  enabled?: boolean;
}): React.JSX.Element {
  const { isDrawing, handlers } = usePawAnimation(onDraw, { enabled });
  return (
    <div
      data-testid="paw-surface"
      data-drawing={isDrawing ? "1" : "0"}
      onPointerEnter={handlers.handlePointerEnter}
      onPointerMove={handlers.handlePointerMove}
      onPointerLeave={handlers.handlePointerLeave}
      onPointerDown={handlers.handlePointerDown}
      onPointerUp={handlers.handlePointerUp}
      onPointerCancel={handlers.handlePointerCancel}
    >
      surface
    </div>
  );
}

describe("usePawAnimation", () => {
  it("exposes isDrawing without requiring consumers to track lag positions", () => {
    const onDraw = vi.fn();
    const { result } = renderHook(() => usePawAnimation(onDraw));
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.handlers.handlePointerMove).toBeTypeOf("function");
  });

  it("toggles isDrawing on mouse enter/leave", () => {
    const onDraw = vi.fn();
    // Queue RAF without synchronous re-entry (animate schedules another frame).
    const queued: FrameRequestCallback[] = [];
    const raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      queued.push(cb);
      return queued.length;
    });
    const caf = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);

    render(<PawHost onDraw={onDraw} />);
    const surface = screen.getByTestId("paw-surface");

    act(() => {
      fireEvent.pointerEnter(surface, { pointerType: "mouse", clientX: 10, clientY: 10 });
    });

    expect(surface).toHaveAttribute("data-drawing", "1");

    act(() => {
      fireEvent.pointerLeave(surface, { pointerType: "mouse" });
    });

    expect(surface).toHaveAttribute("data-drawing", "0");
    expect(queued.length).toBeGreaterThan(0);

    raf.mockRestore();
    caf.mockRestore();
  });
});
