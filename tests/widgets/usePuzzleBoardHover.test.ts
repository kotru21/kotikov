import { act, renderHook } from "@testing-library/react";
import type { PointerEvent } from "react";
import { describe, expect, it } from "vitest";

import { usePuzzleBoardHover } from "@/widgets/puzzle/lib/usePuzzleBoardHover";

function pointerEvent(
  pointerType: string,
  relatedTarget: EventTarget | null = null
): PointerEvent<HTMLAnchorElement> {
  return { pointerType, relatedTarget } as PointerEvent<HTMLAnchorElement>;
}

describe("usePuzzleBoardHover", () => {
  it("sets hover area on mouse enter and clears on leave", () => {
    const { result } = renderHook(() => usePuzzleBoardHover(false));
    expect(result.current.hoverArea).toBeNull();

    act(() => {
      result.current.onCellPointerEnter(pointerEvent("mouse"), "about");
    });
    expect(result.current.hoverArea).toBe("about");

    act(() => {
      result.current.onCellPointerEnter(pointerEvent("mouse"), "k");
    });
    expect(result.current.hoverArea).toBe("k");

    act(() => {
      result.current.onCellPointerLeave(pointerEvent("mouse"));
    });
    expect(result.current.hoverArea).toBeNull();
  });

  it("ignores touch pointers and reduced motion", () => {
    const { result: touch } = renderHook(() => usePuzzleBoardHover(false));
    act(() => {
      touch.current.onCellPointerEnter(pointerEvent("touch"), "contacts");
    });
    expect(touch.current.hoverArea).toBeNull();
    act(() => {
      touch.current.onCellPointerEnter(pointerEvent("touch"), "k");
    });
    expect(touch.current.hoverArea).toBeNull();

    const { result: reduced } = renderHook(() => usePuzzleBoardHover(true));
    act(() => {
      reduced.current.onCellPointerEnter(pointerEvent("mouse"), "about");
    });
    expect(reduced.current.hoverArea).toBeNull();
  });

  it("keeps the next cell when leaving into another puzzle area", () => {
    const { result } = renderHook(() => usePuzzleBoardHover(false));
    const next = document.createElement("a");
    next.setAttribute("data-area", "contacts");

    act(() => {
      result.current.onCellPointerEnter(pointerEvent("mouse"), "about");
    });
    act(() => {
      result.current.onCellPointerLeave(pointerEvent("mouse", next));
    });
    expect(result.current.hoverArea).toBe("about");
  });
});
