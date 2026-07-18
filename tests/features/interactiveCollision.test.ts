import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useInteractiveCollision } from "@/features/interactive-elements";
import type { ContrastSample } from "@/shared/lib";
import { colors } from "@/styles/colors";

interface MockPaintSurface {
  checkCoverage: (rect: DOMRect) => number;
  sampleContrast: (rect: DOMRect) => ContrastSample;
}

interface CollisionHookResult {
  checkCollisions: (
    x: number,
    y: number,
    prevX: number,
    prevY: number,
    paintRef: React.RefObject<MockPaintSurface | null>
  ) => void;
  resyncAll: (paintRef: React.RefObject<MockPaintSurface | null>) => void;
}

function createInteractiveElement(
  rect: DOMRect,
  dataset?: Record<string, string>
): HTMLAnchorElement {
  const el = document.createElement("a");
  Object.entries(dataset ?? {}).forEach(([key, value]) => {
    el.dataset[key] = value;
  });
  Object.defineProperty(el, "getBoundingClientRect", {
    value: () => rect,
  });
  document.body.appendChild(el);
  return el;
}

function createPaintRef(sample: ContrastSample): React.RefObject<MockPaintSurface | null> {
  return {
    current: {
      checkCoverage: vi.fn(() => sample.coverage),
      sampleContrast: vi.fn(() => sample),
    },
  };
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("useInteractiveCollision", () => {
  it("clears stale inline color when sampled coverage stays below the default threshold", () => {
    const el = createInteractiveElement(new DOMRect(0, 0, 80, 30));
    el.style.color = colors.text.primary;

    const interactiveElementsRef = { current: new Set<HTMLElement>([el]) };
    const paintRef = createPaintRef({
      coverage: 0.2,
      luminance: 0.85,
      preferDarkText: true,
    });
    const { result } = renderHook(() => useInteractiveCollision(interactiveElementsRef));

    act(() => {
      (result.current as CollisionHookResult).resyncAll(paintRef);
    });

    expect(el.style.color).toBe("");
  });

  it("applies primary text color for bright covered paint", () => {
    const rect = new DOMRect(0, 0, 100, 40);
    const el = createInteractiveElement(rect);
    const interactiveElementsRef = { current: new Set<HTMLElement>([el]) };
    const paintRef = createPaintRef({
      coverage: 0.8,
      luminance: 0.85,
      preferDarkText: true,
    });
    const { result } = renderHook(() => useInteractiveCollision(interactiveElementsRef));

    act(() => {
      result.current.checkCollisions(10, 10, 0, 0, paintRef);
    });

    expect(el).toHaveStyle({ color: colors.text.primary });
    expect(paintRef.current?.sampleContrast).toHaveBeenCalledWith(rect);
  });

  it("applies inverse text color for dark covered paint", () => {
    const el = createInteractiveElement(new DOMRect(0, 0, 100, 40));
    const interactiveElementsRef = { current: new Set<HTMLElement>([el]) };
    const paintRef = createPaintRef({
      coverage: 0.8,
      luminance: 0.1,
      preferDarkText: false,
    });
    const { result } = renderHook(() => useInteractiveCollision(interactiveElementsRef));

    act(() => {
      result.current.checkCollisions(10, 10, 0, 0, paintRef);
    });

    expect(el).toHaveStyle({ color: colors.text.inverse });
  });

  it("resyncs every registered element without relying on the stroke collision path", () => {
    const rect = new DOMRect(500, 500, 100, 40);
    const el = createInteractiveElement(rect);
    const interactiveElementsRef = { current: new Set<HTMLElement>([el]) };
    const paintRef = createPaintRef({
      coverage: 0.8,
      luminance: 0.85,
      preferDarkText: true,
    });
    const { result } = renderHook(() => useInteractiveCollision(interactiveElementsRef));

    act(() => {
      (result.current as CollisionHookResult).resyncAll(paintRef);
    });

    expect(el).toHaveStyle({ color: colors.text.primary });
    expect(paintRef.current?.sampleContrast).toHaveBeenCalledWith(rect);
  });

  it("preserves a data-interactive-color override when the element is covered", () => {
    const el = createInteractiveElement(new DOMRect(0, 0, 100, 40), {
      interactiveColor: "#ff0000",
    });
    const interactiveElementsRef = { current: new Set<HTMLElement>([el]) };
    const paintRef = createPaintRef({
      coverage: 0.8,
      luminance: 0.85,
      preferDarkText: true,
    });
    const { result } = renderHook(() => useInteractiveCollision(interactiveElementsRef));

    act(() => {
      result.current.checkCollisions(10, 10, 0, 0, paintRef);
    });

    expect(el).toHaveStyle({ color: "#ff0000" });
  });

  it("applies solid mode background, border, text, and shadow for bright covered paint", () => {
    const el = createInteractiveElement(new DOMRect(0, 0, 100, 40), {
      interactiveMode: "solid",
      interactiveShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
    });
    const interactiveElementsRef = { current: new Set<HTMLElement>([el]) };
    const paintRef = createPaintRef({
      coverage: 0.8,
      luminance: 0.85,
      preferDarkText: true,
    });
    const { result } = renderHook(() => useInteractiveCollision(interactiveElementsRef));

    act(() => {
      result.current.checkCollisions(10, 10, 0, 0, paintRef);
    });

    expect(el).toHaveStyle({
      backgroundColor: colors.text.primary,
      borderColor: colors.text.primary,
      color: colors.text.inverse,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
    });
  });

  it("applies border color from contrast in border mode", () => {
    const el = createInteractiveElement(new DOMRect(0, 0, 100, 40), {
      interactiveMode: "border",
    });
    const interactiveElementsRef = { current: new Set<HTMLElement>([el]) };
    const paintRef = createPaintRef({
      coverage: 0.8,
      luminance: 0.85,
      preferDarkText: true,
    });
    const { result } = renderHook(() => useInteractiveCollision(interactiveElementsRef));

    act(() => {
      result.current.checkCollisions(10, 10, 0, 0, paintRef);
    });

    expect(el).toHaveStyle({ borderColor: colors.text.primary });
    expect(el.style.color).toBe("");
  });

  it("clears solid inline styles when coverage stays below the default threshold", () => {
    const el = createInteractiveElement(new DOMRect(0, 0, 80, 30), {
      interactiveMode: "solid",
    });
    el.style.backgroundColor = colors.text.primary;
    el.style.borderColor = colors.text.primary;
    el.style.color = colors.text.inverse;
    el.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.25)";

    const interactiveElementsRef = { current: new Set<HTMLElement>([el]) };
    const paintRef = createPaintRef({
      coverage: 0.2,
      luminance: 0.85,
      preferDarkText: true,
    });
    const { result } = renderHook(() => useInteractiveCollision(interactiveElementsRef));

    act(() => {
      (result.current as CollisionHookResult).resyncAll(paintRef);
    });

    expect(el.style.backgroundColor).toBe("");
    expect(el.style.borderColor).toBe("");
    expect(el.style.color).toBe("");
    expect(el.style.boxShadow).toBe("");
  });

  it("clears solid inline styles when sampled luminance is null", () => {
    const el = createInteractiveElement(new DOMRect(0, 0, 80, 30), {
      interactiveMode: "solid",
    });
    el.style.backgroundColor = colors.text.primary;
    el.style.borderColor = colors.text.primary;
    el.style.color = colors.text.inverse;
    el.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.25)";

    const interactiveElementsRef = { current: new Set<HTMLElement>([el]) };
    const paintRef = createPaintRef({
      coverage: 0.8,
      luminance: null,
      preferDarkText: false,
    });
    const { result } = renderHook(() => useInteractiveCollision(interactiveElementsRef));

    act(() => {
      (result.current as CollisionHookResult).resyncAll(paintRef);
    });

    expect(el.style.backgroundColor).toBe("");
    expect(el.style.borderColor).toBe("");
    expect(el.style.color).toBe("");
    expect(el.style.boxShadow).toBe("");
  });
});
