"use client";

import { useCallback, useEffect, useRef,useState } from "react";

interface UseIsMobileOptions {
  breakpoint?: number;
  debounceMs?: number;
  useMatchMedia?: boolean;
}

export const useIsMobile = (options: UseIsMobileOptions | number = {}): boolean => {
  const config =
    typeof options === "number"
      ? { breakpoint: options, debounceMs: 100, useMatchMedia: true }
      : { breakpoint: 768, debounceMs: 100, useMatchMedia: true, ...options };

  const { breakpoint, debounceMs, useMatchMedia } = config;

  const [isMobile, setIsMobile] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mediaQueryRef = useRef<MediaQueryList | null>(null);

  const checkIsMobile = useCallback((): void => {
    if (typeof window === "undefined") return;

    const newIsMobile = useMatchMedia
      ? window.matchMedia(`(max-width: ${String(breakpoint - 1)}px)`).matches
      : window.innerWidth < breakpoint;

    setIsMobile(newIsMobile);
  }, [breakpoint, useMatchMedia]);

  const debouncedCheck = useCallback((): void => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(checkIsMobile, debounceMs);
  }, [checkIsMobile, debounceMs]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (useMatchMedia) {
      const mediaQuery = window.matchMedia(`(max-width: ${String(breakpoint - 1)}px)`);
      mediaQueryRef.current = mediaQuery;

      const handleChange = (e: MediaQueryListEvent): void => {
        setIsMobile(e.matches);
      };

      setIsMobile(mediaQuery.matches);

      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    } 
      checkIsMobile();
      window.addEventListener("resize", debouncedCheck, { passive: true });

      return () => {
        window.removeEventListener("resize", debouncedCheck);
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }
      };
    
  }, [breakpoint, useMatchMedia, checkIsMobile, debouncedCheck]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return isMobile;
};
