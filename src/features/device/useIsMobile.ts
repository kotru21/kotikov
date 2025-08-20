import { useEffect, useState, useCallback, useRef } from "react";

interface UseIsMobileOptions {
  breakpoint?: number;
  debounceMs?: number;
  useMatchMedia?: boolean;
}

export const useIsMobile = (options: UseIsMobileOptions | number = {}) => {
  const config =
    typeof options === "number"
      ? { breakpoint: options, debounceMs: 100, useMatchMedia: true }
      : { breakpoint: 768, debounceMs: 100, useMatchMedia: true, ...options };

  const { breakpoint, debounceMs, useMatchMedia } = config;

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return useMatchMedia
      ? window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches
      : window.innerWidth < breakpoint;
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mediaQueryRef = useRef<MediaQueryList | null>(null);

  const checkIsMobile = useCallback(() => {
    if (typeof window === "undefined") return;

    const newIsMobile = useMatchMedia
      ? window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches
      : window.innerWidth < breakpoint;

    setIsMobile(newIsMobile);
  }, [breakpoint, useMatchMedia]);

  const debouncedCheck = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(checkIsMobile, debounceMs);
  }, [checkIsMobile, debounceMs]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (useMatchMedia && window.matchMedia) {
      const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
      mediaQueryRef.current = mediaQuery;

      const handleChange = (e: MediaQueryListEvent) => {
        setIsMobile(e.matches);
      };

      setIsMobile(mediaQuery.matches);

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
      } else {
        mediaQuery.addListener(handleChange);
      }

      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener("change", handleChange);
        } else {
          mediaQuery.removeListener(handleChange);
        }
      };
    } else {
      checkIsMobile();
      window.addEventListener("resize", debouncedCheck, { passive: true });

      return () => {
        window.removeEventListener("resize", debouncedCheck);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [breakpoint, useMatchMedia, checkIsMobile, debouncedCheck]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return isMobile;
};
