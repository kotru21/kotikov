"use client";

import { type RefObject, useEffect } from "react";

export const useCanvasLifecycle = (
  init: () => void,
  observeTarget?: RefObject<Element | null>
): void => {
  useEffect(() => {
    init();
    let timeout: number | undefined;
    const scheduleInit = (): void => {
      clearTimeout(timeout);
      timeout = window.setTimeout(init, 100);
    };

    window.addEventListener("resize", scheduleInit, { passive: true });

    const target = observeTarget?.current ?? null;
    const resizeObserver =
      target !== null && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(scheduleInit)
        : null;
    if (target !== null) {
      resizeObserver?.observe(target);
    }

    return () => {
      window.removeEventListener("resize", scheduleInit);
      resizeObserver?.disconnect();
      if (timeout !== undefined) clearTimeout(timeout);
    };
  }, [init, observeTarget]);
};
