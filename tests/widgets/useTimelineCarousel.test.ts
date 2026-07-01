import { act, renderHook } from "@testing-library/react";
import type { KeyboardEvent, TouchEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { useTimelineCarousel } from "@/widgets/timeline";

describe("useTimelineCarousel", () => {
  it("starts at index 0 with correct canGo flags", () => {
    const { result } = renderHook(() => useTimelineCarousel({ itemCount: 4 }));

    expect(result.current.activeIndex).toBe(0);
    expect(result.current.canGoPrev).toBe(false);
    expect(result.current.canGoNext).toBe(true);
  });

  it("does not wrap past the last slide", () => {
    const { result } = renderHook(() => useTimelineCarousel({ itemCount: 4 }));

    act(() => {
      result.current.goTo(3);
    });
    expect(result.current.activeIndex).toBe(3);
    expect(result.current.canGoNext).toBe(false);

    act(() => {
      result.current.goNext();
    });
    expect(result.current.activeIndex).toBe(3);
  });

  it("does not wrap before the first slide", () => {
    const { result } = renderHook(() => useTimelineCarousel({ itemCount: 4 }));

    act(() => {
      result.current.goPrev();
    });
    expect(result.current.activeIndex).toBe(0);
    expect(result.current.canGoPrev).toBe(false);
  });

  it("clamps goTo to valid range", () => {
    const { result } = renderHook(() => useTimelineCarousel({ itemCount: 4 }));

    act(() => {
      result.current.goTo(99);
    });
    expect(result.current.activeIndex).toBe(3);

    act(() => {
      result.current.goTo(-1);
    });
    expect(result.current.activeIndex).toBe(0);
  });

  it("handles ArrowRight and Home keyboard events", () => {
    const { result } = renderHook(() => useTimelineCarousel({ itemCount: 4 }));

    act(() => {
      result.current.handleKeyDown({
        key: "ArrowRight",
        preventDefault: vi.fn(),
      } as KeyboardEvent);
    });
    expect(result.current.activeIndex).toBe(1);

    act(() => {
      result.current.handleKeyDown({
        key: "Home",
        preventDefault: vi.fn(),
      } as KeyboardEvent);
    });
    expect(result.current.activeIndex).toBe(0);
  });

  it("advances on horizontal swipe left", () => {
    const { result } = renderHook(() => useTimelineCarousel({ itemCount: 4 }));

    act(() => {
      result.current.handleTouchStart({
        touches: [{ clientX: 200, clientY: 100 }],
        target: document.createElement("div"),
      } as unknown as TouchEvent);
    });

    act(() => {
      result.current.handleTouchEnd({
        changedTouches: [{ clientX: 100, clientY: 110 }],
      } as unknown as TouchEvent);
    });

    expect(result.current.activeIndex).toBe(1);
  });

  it("goes back on horizontal swipe right", () => {
    const { result } = renderHook(() => useTimelineCarousel({ itemCount: 4 }));

    act(() => {
      result.current.goTo(2);
    });

    act(() => {
      result.current.handleTouchStart({
        touches: [{ clientX: 100, clientY: 100 }],
        target: document.createElement("div"),
      } as unknown as TouchEvent);
    });

    act(() => {
      result.current.handleTouchEnd({
        changedTouches: [{ clientX: 200, clientY: 110 }],
      } as unknown as TouchEvent);
    });

    expect(result.current.activeIndex).toBe(1);
  });

  it("ignores vertical-dominant gestures", () => {
    const { result } = renderHook(() => useTimelineCarousel({ itemCount: 4 }));

    act(() => {
      result.current.handleTouchStart({
        touches: [{ clientX: 100, clientY: 100 }],
        target: document.createElement("div"),
      } as unknown as TouchEvent);
    });

    act(() => {
      result.current.handleTouchEnd({
        changedTouches: [{ clientX: 120, clientY: 220 }],
      } as unknown as TouchEvent);
    });

    expect(result.current.activeIndex).toBe(0);
  });

  it("ignores swipes that start on buttons", () => {
    const { result } = renderHook(() => useTimelineCarousel({ itemCount: 4 }));
    const button = document.createElement("button");

    act(() => {
      result.current.handleTouchStart({
        touches: [{ clientX: 200, clientY: 100 }],
        target: button,
      } as unknown as TouchEvent);
    });

    act(() => {
      result.current.handleTouchEnd({
        changedTouches: [{ clientX: 100, clientY: 100 }],
      } as unknown as TouchEvent);
    });

    expect(result.current.activeIndex).toBe(0);
  });
});
