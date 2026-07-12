import { act, renderHook } from "@testing-library/react";
import type { KeyboardEvent } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  TIMELINE_RAIL_SCROLL_GAP_PX,
  useTimelineEditorialRail,
} from "@/widgets/timeline/hooks/useTimelineEditorialRail";

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({ reducedMotion: true, lowPerformance: false }),
}));

describe("useTimelineEditorialRail", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("scrollByCard uses card width + gap and respects reduced motion", () => {
    const { result } = renderHook(() => useTimelineEditorialRail(3));
    const scroller = document.createElement("div");
    const card = document.createElement("div");
    card.setAttribute("data-timeline-card", "");
    Object.defineProperty(card, "offsetWidth", { configurable: true, value: 400 });
    scroller.appendChild(card);
    const scrollBy = vi.fn();
    scroller.scrollBy = scrollBy;
    // Attach ref before calling scroll helpers
    (
      result.current.scrollerRef as { current: HTMLDivElement | null }
    ).current = scroller;

    act(() => {
      result.current.scrollByCard(1);
    });

    expect(scrollBy).toHaveBeenCalledWith({
      left: 400 + TIMELINE_RAIL_SCROLL_GAP_PX,
      behavior: "auto",
    });
  });

  it("handleKeyDown maps arrows to scroll directions", () => {
    const { result } = renderHook(() => useTimelineEditorialRail(3));
    const scroller = document.createElement("div");
    const scrollBy = vi.fn();
    scroller.scrollBy = scrollBy;
    (result.current.scrollerRef as { current: HTMLDivElement | null }).current = scroller;

    act(() => {
      result.current.handleKeyDown({
        key: "ArrowRight",
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent<HTMLDivElement>);
    });
    act(() => {
      result.current.handleKeyDown({
        key: "ArrowLeft",
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent<HTMLDivElement>);
    });

    expect(scrollBy).toHaveBeenCalledTimes(2);
  });
});
