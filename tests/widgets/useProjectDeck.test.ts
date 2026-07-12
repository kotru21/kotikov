import { act, renderHook } from "@testing-library/react";
import type { KeyboardEvent, TouchEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { useProjectDeck } from "@/widgets/projects/ui/useProjectDeck";

function keyEvent(key: string): KeyboardEvent {
  return { key, preventDefault: vi.fn() } as unknown as KeyboardEvent;
}

function touchStart(clientX: number): TouchEvent<HTMLDivElement> {
  return { touches: [{ clientX }] } as unknown as TouchEvent<HTMLDivElement>;
}

function touchEnd(clientX: number): TouchEvent<HTMLDivElement> {
  return { changedTouches: [{ clientX }] } as unknown as TouchEvent<HTMLDivElement>;
}

describe("useProjectDeck", () => {
  it("navigates with goTo, goNext, goPrev and wraps around", () => {
    const { result } = renderHook(() => useProjectDeck({ count: 3 }));

    expect(result.current.activeIndex).toBe(0);

    act(() => {
      result.current.goNext();
    });
    expect(result.current.activeIndex).toBe(1);

    act(() => {
      result.current.goPrev();
    });
    expect(result.current.activeIndex).toBe(0);

    act(() => {
      result.current.goTo(-1);
    });
    expect(result.current.activeIndex).toBe(2);

    act(() => {
      result.current.goNext();
    });
    expect(result.current.activeIndex).toBe(0);
  });

  it("ignores navigation when count is zero", () => {
    const { result } = renderHook(() => useProjectDeck({ count: 0 }));

    act(() => {
      result.current.goTo(2);
      result.current.goNext();
      result.current.goPrev();
    });
    expect(result.current.activeIndex).toBe(0);
  });

  it("handles keyboard Home/End and arrows", () => {
    const { result } = renderHook(() => useProjectDeck({ count: 4 }));

    act(() => {
      result.current.handleKeyDown(keyEvent("ArrowRight"));
    });
    expect(result.current.activeIndex).toBe(1);

    act(() => {
      result.current.handleKeyDown(keyEvent("ArrowLeft"));
    });
    expect(result.current.activeIndex).toBe(0);

    act(() => {
      result.current.handleKeyDown(keyEvent("End"));
    });
    expect(result.current.activeIndex).toBe(3);

    act(() => {
      result.current.handleKeyDown(keyEvent("Home"));
    });
    expect(result.current.activeIndex).toBe(0);

    act(() => {
      result.current.handleKeyDown(keyEvent("Enter"));
    });
    expect(result.current.activeIndex).toBe(0);
  });

  it("swipes left and right past the threshold", () => {
    const { result } = renderHook(() => useProjectDeck({ count: 3 }));

    act(() => {
      result.current.handleTouchStart(touchStart(200));
      result.current.handleTouchEnd(touchEnd(100));
    });
    expect(result.current.activeIndex).toBe(1);

    act(() => {
      result.current.handleTouchStart(touchStart(100));
      result.current.handleTouchEnd(touchEnd(220));
    });
    expect(result.current.activeIndex).toBe(0);

    act(() => {
      result.current.handleTouchStart(touchStart(100));
      result.current.handleTouchEnd(touchEnd(110));
    });
    expect(result.current.activeIndex).toBe(0);

    act(() => {
      result.current.handleTouchEnd(touchEnd(50));
    });
    expect(result.current.activeIndex).toBe(0);
  });
});
