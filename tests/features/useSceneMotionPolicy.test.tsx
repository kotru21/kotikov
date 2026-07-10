import { act, fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useSceneMotionPolicy } from "@/features/performance";

vi.mock("@/features/performance/usePerformanceSettings", () => ({
  usePerformanceSettings: () => ({
    reducedMotion: false,
    lowPerformance: false,
  }),
}));

type ObserverCallback = IntersectionObserverCallback;

let observerCallback: ObserverCallback | null = null;
const disconnect = vi.fn();
const observe = vi.fn();

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0.15];
  readonly observe = observe;
  readonly unobserve = vi.fn();
  readonly disconnect = disconnect;
  readonly takeRecords = vi.fn((): IntersectionObserverEntry[] => []);

  constructor(callback: ObserverCallback) {
    observerCallback = callback;
  }
}

function SceneProbe(): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useSceneMotionPolicy(ref, { dominantEffect: "marquee" });

  return (
    <div ref={ref}>
      <output>{String(motion.canRunContinuous)}</output>
    </div>
  );
}

function triggerIntersection(isIntersecting: boolean): void {
  act(() => {
    observerCallback?.(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
  });
}

describe("useSceneMotionPolicy", () => {
  beforeEach(() => {
    observerCallback = null;
    disconnect.mockClear();
    observe.mockClear();
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
  });

  it("gates continuous motion on intersection and document visibility", () => {
    const { unmount } = render(<SceneProbe />);
    expect(screen.getByText("false")).toBeInTheDocument();

    triggerIntersection(true);
    expect(screen.getByText("true")).toBeInTheDocument();

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });
    fireEvent(document, new Event("visibilitychange"));
    expect(screen.getByText("false")).toBeInTheDocument();

    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
