"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks the scroll position of a section relative to the viewport
 * and returns a lateral offset in pixels.
 *
 * offset ranges from -intensity to +intensity:
 *   -intensity  → section is fully below viewport (entering)
 *   0           → section center is at viewport center
 *   +intensity  → section is fully above viewport (exiting)
 */
export const useScrollParallax = (
  intensity = 100
): {
  sectionRef: React.RefObject<HTMLElement | null>;
  offset: number;
} => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const update = (): void => {
      const el = sectionRef.current;
      if (el === null) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // progress: 0 when entering from bottom, 1 when exiting from top
      const total = rect.height + vh;
      const scrolled = vh - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / total));

      setOffset((progress - 0.5) * intensity * 2);
    };

    const onScroll = (): void => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        update();
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [intensity]);

  return { sectionRef, offset };
};
