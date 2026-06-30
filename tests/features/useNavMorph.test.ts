import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { computeNavMorph, useNavMorph } from "@/features/scrolling/useNavMorph";

const LG_MEDIA_QUERY = "(min-width: 1024px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

interface MockMediaQueryList {
  matches: boolean;
  media: string;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
}

const mediaQueryMocks = new Map<string, MockMediaQueryList>();

const createMatchMedia = (
  options: {
    desktop?: boolean;
    reducedMotion?: boolean;
  } = {}
): ((query: string) => MockMediaQueryList) => {
  const listeners = new Map<string, Set<() => void>>();

  const getMatches = (query: string): boolean => {
    if (query === LG_MEDIA_QUERY) return options.desktop ?? true;
    if (query === REDUCED_MOTION_QUERY) return options.reducedMotion ?? false;
    return false;
  };

  const factory = (query: string): MockMediaQueryList => {
    const existing = mediaQueryMocks.get(query);
    if (existing) return existing;

    const mediaQuery: MockMediaQueryList = {
      get matches() {
        return getMatches(query);
      },
      media: query,
      addEventListener: vi.fn((_: string, handler: () => void) => {
        const set = listeners.get(query) ?? new Set();
        set.add(handler);
        listeners.set(query, set);
      }),
      removeEventListener: vi.fn((_: string, handler: () => void) => {
        listeners.get(query)?.delete(handler);
      }),
    };

    mediaQueryMocks.set(query, mediaQuery);
    return mediaQuery;
  };

  return factory;
};

const performanceSettings = vi.hoisted(() => ({
  reducedMotion: false,
  lowPerformance: false,
}));

vi.mock("@/features/performance", () => ({
  usePerformanceSettings: () => ({
    reducedMotion: performanceSettings.reducedMotion,
    lowPerformance: performanceSettings.lowPerformance,
  }),
}));

describe("computeNavMorph", () => {
  it("returns zero progress at top", () => {
    expect(computeNavMorph(0)).toEqual({ progress: 0, phase: 0, isIsland: false });
  });

  it("maps phase 1 scroll to 0..0.4 progress", () => {
    expect(computeNavMorph(20)).toEqual({ progress: 0.2, phase: 1, isIsland: false });
  });

  it("maps mid phase 2 scroll correctly", () => {
    expect(computeNavMorph(60)).toEqual({ progress: 0.55, phase: 2, isIsland: false });
  });

  it("locks island at end of phase 2", () => {
    expect(computeNavMorph(120)).toEqual({ progress: 1, phase: 2, isIsland: true });
  });

  it("stays locked beyond phase 2", () => {
    expect(computeNavMorph(200)).toEqual({ progress: 1, phase: 2, isIsland: true });
  });

  it("uses binary progress when snap morph is enabled", () => {
    expect(computeNavMorph(30, true)).toEqual({ progress: 0, phase: 0, isIsland: false });
    expect(computeNavMorph(61, true)).toEqual({ progress: 1, phase: 2, isIsland: true });
  });
});

describe("useNavMorph", () => {
  let scrollY = 0;
  let rafCallbacks: FrameRequestCallback[] = [];
  let scrollHandlers = new Set<EventListenerOrEventListenerObject>();
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    scrollY = 0;
    rafCallbacks = [];
    scrollHandlers = new Set();
    mediaQueryMocks.clear();
    performanceSettings.reducedMotion = false;
    performanceSettings.lowPerformance = false;

    vi.stubGlobal("matchMedia", createMatchMedia({ desktop: true, reducedMotion: false }));

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      get: () => scrollY,
    });

    vi.spyOn(window, "addEventListener").mockImplementation((type, listener) => {
      if (type === "scroll") {
        scrollHandlers.add(listener);
      }
    });

    removeEventListenerSpy = vi.spyOn(window, "removeEventListener").mockImplementation((type, listener) => {
      if (type === "scroll") {
        scrollHandlers.delete(listener);
      }
    });

    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      rafCallbacks.push(callback);
      return rafCallbacks.length;
    });

    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const flushRaf = (): void => {
    const callbacks = [...rafCallbacks];
    rafCallbacks = [];
    callbacks.forEach((callback) => {
      callback(0);
    });
  };

  const fireScroll = (): void => {
    act(() => {
      scrollHandlers.forEach((handler) => {
        if (typeof handler === "function") {
          handler(new Event("scroll"));
        }
      });
    });
    act(() => {
      flushRaf();
    });
  };

  it("cleans up scroll and media-query listeners on unmount", () => {
    const { unmount } = renderHook(() => useNavMorph());
    const desktopRemoveListener = mediaQueryMocks.get(LG_MEDIA_QUERY)?.removeEventListener;

    expect(scrollHandlers.size).toBe(1);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(desktopRemoveListener).toHaveBeenCalledWith("change", expect.any(Function));
    expect(scrollHandlers.size).toBe(0);
  });

  it("coalesces scroll updates to one rAF callback per frame", () => {
    scrollY = 40;
    renderHook(() => useNavMorph());
    rafCallbacks = [];

    act(() => {
      scrollHandlers.forEach((handler) => {
        if (typeof handler === "function") {
          handler(new Event("scroll"));
          handler(new Event("scroll"));
          handler(new Event("scroll"));
        }
      });
    });

    expect(rafCallbacks).toHaveLength(1);
  });

  it("resets morph state when viewport is below lg", () => {
    vi.stubGlobal("matchMedia", createMatchMedia({ desktop: false }));

    scrollY = 120;
    const { result } = renderHook(() => useNavMorph());

    expect(result.current).toEqual({ progress: 0, phase: 0, isIsland: false });
  });

  it("reacts to desktop breakpoint changes", () => {
    let desktopMatches = true;
    const listeners = new Set<() => void>();

    vi.stubGlobal("matchMedia", (query: string) => ({
      get matches() {
        if (query === LG_MEDIA_QUERY) return desktopMatches;
        return false;
      },
      media: query,
      addEventListener: vi.fn((_: string, handler: () => void) => {
        if (query === LG_MEDIA_QUERY) listeners.add(handler);
      }),
      removeEventListener: vi.fn((_: string, handler: () => void) => {
        listeners.delete(handler);
      }),
    }));

    scrollY = 120;
    const { result } = renderHook(() => useNavMorph());

    expect(result.current.isIsland).toBe(true);

    desktopMatches = false;

    act(() => {
      listeners.forEach((handler) => {
        handler();
      });
    });

    expect(result.current).toEqual({ progress: 0, phase: 0, isIsland: false });
  });

  it("snaps morph state when reduced motion is enabled", () => {
    scrollY = 80;

    performanceSettings.reducedMotion = false;
    const { result, rerender } = renderHook(() => useNavMorph());

    expect(result.current.progress).toBeGreaterThan(0);
    expect(result.current.progress).toBeLessThan(1);

    performanceSettings.reducedMotion = true;
    rerender();

    expect(result.current).toEqual({ progress: 1, phase: 2, isIsland: true });
  });

  it("snaps morph state when low performance is enabled", () => {
    scrollY = 80;
    performanceSettings.lowPerformance = true;

    const { result } = renderHook(() => useNavMorph());

    expect(result.current).toEqual({ progress: 1, phase: 2, isIsland: true });
  });

  it("updates morph state on scroll", () => {
    const { result } = renderHook(() => useNavMorph());

    expect(result.current.progress).toBe(0);

    scrollY = 20;
    fireScroll();

    expect(result.current).toEqual(computeNavMorph(20));
  });
});
