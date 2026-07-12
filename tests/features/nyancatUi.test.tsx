import { act, fireEvent, render, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { buildNyancatKeyframes } from "@/features/nyancat";
import { useExplosion } from "@/features/nyancat/hooks/useExplosion";
import { NyancatImage } from "@/features/nyancat/ui/NyancatImage";

interface MovingWrapperCallbacks {
  onClick: ReturnType<typeof vi.fn>;
  onMouseEnter: ReturnType<typeof vi.fn>;
}

function expectPointerInteraction(wrapper: Element, callbacks: MovingWrapperCallbacks): void {
  fireEvent.click(wrapper);
  fireEvent.touchStart(wrapper);
  fireEvent.mouseEnter(wrapper);

  expect(callbacks.onClick).toHaveBeenCalledTimes(2);
  expect(callbacks.onMouseEnter).toHaveBeenCalledTimes(1);
}

function expectHiddenFromKeyboard(wrapper: Element): void {
  expect(wrapper).not.toHaveAttribute("role", "button");
  expect(wrapper).not.toHaveAttribute("tabindex", "0");
  expect(wrapper).toHaveAttribute("aria-hidden", "true");
}

function getMovingWrapper(container: HTMLElement): Element {
  const wrapper = container.firstElementChild;

  if (!wrapper) throw new Error("Expected a moving Nyancat wrapper");
  return wrapper;
}

function stubElementCenter(node: HTMLDivElement): void {
  node.getBoundingClientRect = (): DOMRect => ({
    left: 10,
    top: 20,
    width: 40,
    height: 20,
    right: 50,
    bottom: 40,
    x: 10,
    y: 20,
    toJSON: () => ({}),
  });
}

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

describe("NyancatImage", () => {
  it("keeps pointer interaction without exposing the moving wrapper to keyboard users", () => {
    const callbacks = { onClick: vi.fn(), onMouseEnter: vi.fn() };
    const { container } = render(
      <NyancatImage
        size="small"
        animationName="fly"
        animationDuration="2s"
        animationDelay="0s"
        isMobile={false}
        {...callbacks}
      />
    );
    const wrapper = getMovingWrapper(container);

    expectHiddenFromKeyboard(wrapper);
    expectPointerInteraction(wrapper, callbacks);
  });
});

describe("buildNyancatKeyframes", () => {
  it("emits fly and bank keyframe blocks", () => {
    const css = buildNyancatKeyframes();
    expect(css).toContain("@keyframes nyancat-fly");
    expect(css).toContain("@keyframes nyancat-bank");
    expect(css).toContain("0%");
    expect(css).toContain("100%");
  });
});

describe("useExplosion", () => {
  afterEach(() => {
    performanceSettings.reducedMotion = false;
    performanceSettings.lowPerformance = false;
    vi.unstubAllGlobals();
  });

  it("cancels the animation frame on unmount", () => {
    const cancelAnimationFrame = vi.fn();
    const requestAnimationFrame = vi.fn((): number => 42);
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame);

    const { result, unmount } = renderHook(() => useExplosion("small"));
    const node = document.createElement("div");
    stubElementCenter(node);

    act(() => {
      (result.current.nyancatRef as { current: HTMLDivElement | null }).current = node;
      result.current.explode();
    });

    expect(requestAnimationFrame).toHaveBeenCalled();
    unmount();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
  });

  it("ends immediately under reduced motion", () => {
    performanceSettings.reducedMotion = true;
    const requestAnimationFrame = vi.fn((cb: FrameRequestCallback): number => {
      cb(performance.now());
      return 1;
    });
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);
    vi.stubGlobal("cancelAnimationFrame", vi.fn());

    const { result } = renderHook(() => useExplosion("xlarge"));
    const node = document.createElement("div");
    stubElementCenter(node);

    act(() => {
      (result.current.nyancatRef as { current: HTMLDivElement | null }).current = node;
      result.current.explode();
    });

    expect(result.current.isExploded).toBe(false);
    expect(result.current.pixels).toHaveLength(0);
  });
});
