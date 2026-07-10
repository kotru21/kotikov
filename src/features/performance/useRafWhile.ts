"use client";

import { useEffect, useRef } from "react";

export function useRafWhile(active: boolean, onFrame: (time: number) => void): void {
  const callbackRef = useRef(onFrame);

  useEffect(() => {
    callbackRef.current = onFrame;
  }, [onFrame]);

  useEffect(() => {
    if (!active) return;

    let frameId = 0;
    const tick = (time: number): void => {
      callbackRef.current(time);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [active]);
}
