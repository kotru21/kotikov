"use client";

import { useMemo, useSyncExternalStore } from "react";

interface UseIsMobileOptions {
  breakpoint?: number;
  debounceMs?: number;
  useMatchMedia?: boolean;
}

function subscribeMatchMedia(query: string, onStoreChange: () => void): () => void {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => {
    mediaQuery.removeEventListener("change", onStoreChange);
  };
}

function subscribeResize(debounceMs: number, onStoreChange: () => void): () => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const onResize = (): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      timeout = null;
      onStoreChange();
    }, debounceMs);
  };
  window.addEventListener("resize", onResize, { passive: true });
  return () => {
    window.removeEventListener("resize", onResize);
    if (timeout !== null) {
      clearTimeout(timeout);
    }
  };
}

export const useIsMobile = (options: UseIsMobileOptions | number = {}): boolean => {
  const config =
    typeof options === "number"
      ? { breakpoint: options, debounceMs: 100, useMatchMedia: true }
      : { breakpoint: 768, debounceMs: 100, useMatchMedia: true, ...options };

  const { breakpoint, debounceMs, useMatchMedia } = config;
  const query = `(max-width: ${String(breakpoint - 1)}px)`;

  const subscribe = useMemo(
    () =>
      (onStoreChange: () => void): (() => void) => {
        if (useMatchMedia) {
          return subscribeMatchMedia(query, onStoreChange);
        }
        return subscribeResize(debounceMs, onStoreChange);
      },
    [query, useMatchMedia, debounceMs]
  );

  return useSyncExternalStore(
    subscribe,
    () =>
      useMatchMedia
        ? window.matchMedia(query).matches
        : window.innerWidth < breakpoint,
    () => false
  );
};
