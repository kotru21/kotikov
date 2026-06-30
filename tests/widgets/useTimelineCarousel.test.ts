import { act, renderHook } from "@testing-library/react";
import type { KeyboardEvent } from "react";
import { describe, expect, it } from "vitest";

import { useTimelineCarousel } from "@/widgets/timeline/hooks/useTimelineCarousel";

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
        preventDefault: () => {},
      } as KeyboardEvent);
    });
    expect(result.current.activeIndex).toBe(1);

    act(() => {
      result.current.handleKeyDown({
        key: "Home",
        preventDefault: () => {},
      } as KeyboardEvent);
    });
    expect(result.current.activeIndex).toBe(0);
  });
});
