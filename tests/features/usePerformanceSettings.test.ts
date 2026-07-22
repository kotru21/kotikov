import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { usePerformanceSettings } from "@/features/performance/usePerformanceSettings";

describe("usePerformanceSettings", () => {
  it("reads reduced-motion from matchMedia after mount (SSR-safe defaults until then)", async () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
    Object.defineProperty(navigator, "hardwareConcurrency", {
      configurable: true,
      value: 8,
    });

    const { result } = renderHook(() => usePerformanceSettings());

    await waitFor(() => {
      expect(result.current.reducedMotion).toBe(true);
    });
    expect(result.current.lowPerformance).toBe(false);

    vi.unstubAllGlobals();
  });
});
