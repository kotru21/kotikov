"use client";

import { useLayoutEffect, useState } from "react";

export type ResponsiveViewMode = "both" | "mobile" | "desktop";

/**
 * SSR/hydration start with both trees (avoids CLS/hydration skew), then prune to the
 * active breakpoint in useLayoutEffect — before the browser paints — so the inactive
 * island is not visible on first paint.
 */
export function useResponsiveViewMode(breakpointPx = 768): ResponsiveViewMode {
  const [mode, setMode] = useState<ResponsiveViewMode>("both");

  useLayoutEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia(`(max-width: ${String(breakpointPx - 1)}px)`);
    const sync = (): void => {
      setMode(mediaQuery.matches ? "mobile" : "desktop");
    };

    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, [breakpointPx]);

  return mode;
}
