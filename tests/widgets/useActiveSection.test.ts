import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ACTIVE_SECTION_OBSERVER_OPTIONS,
  ACTIVE_SECTION_THRESHOLDS,
  DESKTOP_CHROME_ROOT_MARGIN,
  MOBILE_CHROME_ROOT_MARGIN,
  useActiveSection,
} from "@/widgets/shell/hooks/useActiveSection";

/** IntersectionObserver accepts only px or percent — rem throws in the browser. */
const ROOT_MARGIN_TOKEN = /^-?\d+(\.\d+)?(px|%)$/;

function assertValidRootMargin(value: string): void {
  const parts = value.trim().split(/\s+/);
  expect(parts.length === 1 || parts.length === 4).toBe(true);
  for (const part of parts) {
    expect(part).toMatch(ROOT_MARGIN_TOKEN);
  }
}

type ObserverCallback = IntersectionObserverCallback;

let observerCallback: ObserverCallback | null = null;
let lastOptions: IntersectionObserverInit | undefined;
const observe = vi.fn();
const disconnect = vi.fn();

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly scrollMargin = "0px";
  readonly thresholds = [0];
  readonly observe = observe;
  readonly unobserve = vi.fn();
  readonly disconnect = disconnect;
  readonly takeRecords = vi.fn((): IntersectionObserverEntry[] => []);

  constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
    observerCallback = callback;
    lastOptions = options;
  }
}

const SECTION_IDS = ["about", "projects", "skills", "experience", "contacts"] as const;

function mountSections(ids: readonly string[]): HTMLElement[] {
  return ids.map((id) => {
    const el = document.createElement("section");
    el.id = id;
    document.body.append(el);
    return el;
  });
}

function entry(
  target: Element,
  intersectionRatio: number,
  isIntersecting = intersectionRatio > 0
): IntersectionObserverEntry {
  return { target, intersectionRatio, isIntersecting } as IntersectionObserverEntry;
}

describe("useActiveSection", () => {
  beforeEach(() => {
    observerCallback = null;
    lastOptions = undefined;
    observe.mockClear();
    disconnect.mockClear();
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("min-width: 768px"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    document.body.replaceChildren();
    vi.unstubAllGlobals();
  });

  it("returns the intersecting section with the highest ratio", () => {
    const [, projects] = mountSections(SECTION_IDS);
    const { result } = renderHook(() => useActiveSection(SECTION_IDS));

    expect(result.current).toBeNull();

    act(() => {
      observerCallback?.([entry(projects, 0.8)], {} as IntersectionObserver);
    });

    expect(result.current).toBe("projects");
  });

  it("picks the highest ratio when several sections intersect", () => {
    const [about, projects] = mountSections(SECTION_IDS);
    const { result } = renderHook(() => useActiveSection(SECTION_IDS));

    act(() => {
      observerCallback?.([entry(about, 0.4), entry(projects, 0.9)], {} as IntersectionObserver);
    });

    expect(result.current).toBe("projects");
  });

  it("returns null when nothing intersects", () => {
    const [about] = mountSections(["about"]);
    const { result } = renderHook(() => useActiveSection(["about"]));

    act(() => {
      observerCallback?.([entry(about, 0, false)], {} as IntersectionObserver);
    });

    expect(result.current).toBeNull();
  });

  it("can report skills as the active section", () => {
    const skills = mountSections(["skills"])[0];
    const { result } = renderHook(() => useActiveSection(["skills"]));

    act(() => {
      observerCallback?.([entry(skills, 1)], {} as IntersectionObserver);
    });

    expect(result.current).toBe("skills");
  });

  it("observes with stepped thresholds so ratios update while sections stay intersecting", () => {
    mountSections(SECTION_IDS);
    renderHook(() => useActiveSection(SECTION_IDS));

    expect(lastOptions?.threshold).toEqual([...ACTIVE_SECTION_THRESHOLDS]);
    expect(lastOptions?.rootMargin).toBe(ACTIVE_SECTION_OBSERVER_OPTIONS.rootMargin);
  });

  it("uses only px or percent in observer rootMargin", () => {
    assertValidRootMargin(DESKTOP_CHROME_ROOT_MARGIN);
    assertValidRootMargin(MOBILE_CHROME_ROOT_MARGIN);
  });

  it("insets the observer by the mobile title bar and bottom nav", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    mountSections(SECTION_IDS);
    renderHook(() => useActiveSection(SECTION_IDS));

    expect(lastOptions?.rootMargin).toBe(MOBILE_CHROME_ROOT_MARGIN);
  });

  it("updates the winner while both sections stay intersecting", () => {
    const [about, projects] = mountSections(SECTION_IDS);
    const { result } = renderHook(() => useActiveSection(SECTION_IDS));

    act(() => {
      observerCallback?.([entry(about, 0.8), entry(projects, 0.2)], {} as IntersectionObserver);
    });
    expect(result.current).toBe("about");

    act(() => {
      observerCallback?.([entry(about, 0.2), entry(projects, 0.7)], {} as IntersectionObserver);
    });
    expect(result.current).toBe("projects");
  });
});
