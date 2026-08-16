import { act, renderHook } from "@testing-library/react";
import type { KeyboardEvent, TouchEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { useProjectDeck } from "@/widgets/projects/ui/useProjectDeck";

function keyEvent(
  key: string,
  nodes?: { target: EventTarget; currentTarget: EventTarget }
): KeyboardEvent<HTMLDivElement> {
  return {
    key,
    preventDefault: vi.fn(),
    target: nodes?.target,
    currentTarget: nodes?.currentTarget,
  } as unknown as KeyboardEvent<HTMLDivElement>;
}

function touchStart(
  clientX: number,
  clientY = 100,
  target: EventTarget = document.createElement("div")
): TouchEvent<HTMLDivElement> {
  return {
    touches: [{ clientX, clientY }],
    target,
  } as unknown as TouchEvent<HTMLDivElement>;
}

function touchEnd(clientX: number, clientY = 100): TouchEvent<HTMLDivElement> {
  return { changedTouches: [{ clientX, clientY }] } as unknown as TouchEvent<HTMLDivElement>;
}

describe("useProjectDeck", () => {
  it("starts at index 0 with correct canGo flags", () => {
    const { result } = renderHook(() => useProjectDeck({ count: 4 }));

    expect(result.current.activeIndex).toBe(0);
    expect(result.current.canGoPrev).toBe(false);
    expect(result.current.canGoNext).toBe(true);
  });

  it("does not wrap past the last slide", () => {
    const { result } = renderHook(() => useProjectDeck({ count: 4 }));

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
    const { result } = renderHook(() => useProjectDeck({ count: 4 }));

    act(() => {
      result.current.goPrev();
    });
    expect(result.current.activeIndex).toBe(0);
    expect(result.current.canGoPrev).toBe(false);
  });

  it("clamps goTo to valid range and ignores empty decks", () => {
    const { result } = renderHook(() => useProjectDeck({ count: 4 }));

    act(() => {
      result.current.goTo(99);
    });
    expect(result.current.activeIndex).toBe(3);

    act(() => {
      result.current.goTo(-1);
    });
    expect(result.current.activeIndex).toBe(0);

    const empty = renderHook(() => useProjectDeck({ count: 0 }));
    act(() => {
      empty.result.current.goTo(2);
      empty.result.current.goNext();
      empty.result.current.goPrev();
    });
    expect(empty.result.current.activeIndex).toBe(0);
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

  it("ignores arrow and Home keys when focus is on a link inside a slide", () => {
    const { result } = renderHook(() => useProjectDeck({ count: 4 }));
    const region = document.createElement("div");
    const link = document.createElement("a");
    region.append(link);
    const preventArrow = vi.fn();
    const preventHome = vi.fn();

    act(() => {
      result.current.handleKeyDown({
        ...keyEvent("ArrowRight", { target: link, currentTarget: region }),
        preventDefault: preventArrow,
      });
      result.current.handleKeyDown({
        ...keyEvent("Home", { target: link, currentTarget: region }),
        preventDefault: preventHome,
      });
    });

    expect(result.current.activeIndex).toBe(0);
    expect(preventArrow).not.toHaveBeenCalled();
    expect(preventHome).not.toHaveBeenCalled();
  });

  it("still advances from a chevron button", () => {
    const { result } = renderHook(() => useProjectDeck({ count: 4 }));
    const region = document.createElement("div");
    const chevron = document.createElement("button");
    chevron.setAttribute("data-carousel-chevron", "");
    region.append(chevron);

    act(() => {
      result.current.handleKeyDown(
        keyEvent("ArrowRight", { target: chevron, currentTarget: region })
      );
    });

    expect(result.current.activeIndex).toBe(1);
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

  it("ignores vertical-dominant gestures", () => {
    const { result } = renderHook(() => useProjectDeck({ count: 3 }));

    act(() => {
      result.current.handleTouchStart(touchStart(100, 100));
      result.current.handleTouchEnd(touchEnd(120, 220));
    });
    expect(result.current.activeIndex).toBe(0);
  });

  it("ignores swipes that start on buttons", () => {
    const { result } = renderHook(() => useProjectDeck({ count: 3 }));
    const button = document.createElement("button");

    act(() => {
      result.current.handleTouchStart(touchStart(200, 100, button));
      result.current.handleTouchEnd(touchEnd(100));
    });
    expect(result.current.activeIndex).toBe(0);
  });

  it("clears in-progress swipe on touchcancel", () => {
    const { result } = renderHook(() => useProjectDeck({ count: 3 }));

    act(() => {
      result.current.handleTouchStart(touchStart(200));
      result.current.handleTouchCancel();
      result.current.handleTouchEnd(touchEnd(100));
    });
    expect(result.current.activeIndex).toBe(0);
  });
});
