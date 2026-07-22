"use client";

import { type PointerEvent, useCallback, useEffect, useRef, useState } from "react";

import { isInteractiveTarget } from "@/shared/lib";

interface MousePosition {
  x: number;
  y: number;
}

interface PawAnimationState {
  mousePos: MousePosition;
  smoothMousePos: MousePosition;
  pawPos: MousePosition;
  pawVelocity: MousePosition;
  isDrawing: boolean;
}

interface PawAnimationHandlers {
  handlePointerEnter: (e: PointerEvent<HTMLElement>) => void;
  handlePointerMove: (e: PointerEvent<HTMLElement>) => void;
  handlePointerLeave: (e: PointerEvent<HTMLElement>) => void;
  handlePointerDown: (e: PointerEvent<HTMLElement>) => void;
  handlePointerUp: (e: PointerEvent<HTMLElement>) => void;
  handlePointerCancel: (e: PointerEvent<HTMLElement>) => void;
}

interface UsePawAnimationOptions {
  /** When false, handlers no-op and drawing state stays off (e.g. reduced motion). */
  enabled?: boolean;
}

interface UsePawAnimationReturn extends PawAnimationState {
  handlers: PawAnimationHandlers;
}

const INITIAL_STATE: PawAnimationState = {
  mousePos: { x: 0, y: 0 },
  smoothMousePos: { x: 0, y: 0 },
  pawPos: { x: 0, y: 0 },
  pawVelocity: { x: 0, y: 0 },
  isDrawing: false,
};

function withDrawingStart(prev: PawAnimationState, x: number, y: number): PawAnimationState {
  const needsOrigin = prev.pawPos.x === 0 && prev.pawPos.y === 0;
  return {
    ...prev,
    isDrawing: true,
    mousePos: { x, y },
    ...(needsOrigin
      ? {
          pawPos: { x, y },
          smoothMousePos: { x, y },
        }
      : {}),
  };
}

export function usePawAnimation(
  onDraw: (x: number, y: number, prevX: number, prevY: number) => void,
  options: UsePawAnimationOptions = {}
): UsePawAnimationReturn {
  const enabled = options.enabled ?? true;

  const [state, setState] = useState<PawAnimationState>(INITIAL_STATE);
  const enabledRef = useRef(enabled);
  const stateRef = useRef(state);
  const onDrawRef = useRef(onDraw);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    onDrawRef.current = onDraw;
  }, [onDraw]);

  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef(0);
  const mouseVelocityRef = useRef({ x: 0, y: 0 });
  const pointerDownRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const kickAnimationRef = useRef<() => void>(() => undefined);

  // Adjust state during render when drawing is disabled (not in an effect).
  if (!enabled && state.isDrawing) {
    setState((prev) => ({
      ...prev,
      isDrawing: false,
      pawVelocity: { x: 0, y: 0 },
    }));
  }

  useEffect(() => {
    if (enabled) return;
    mouseVelocityRef.current = { x: 0, y: 0 };
    pointerDownRef.current = false;
    pointerIdRef.current = null;
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [enabled]);

  const updatePointerPos = useCallback((x: number, y: number): void => {
    setState((prev) => {
      const deltaX = x - prev.mousePos.x;
      const deltaY = y - prev.mousePos.y;
      mouseVelocityRef.current = { x: deltaX, y: deltaY };
      const next = { ...prev, mousePos: { x, y } };
      stateRef.current = next;
      return next;
    });
    kickAnimationRef.current();
  }, []);

  const stopDrawing = useCallback(() => {
    setState((prev) => {
      const next = {
        ...prev,
        isDrawing: false,
        pawVelocity: { x: 0, y: 0 },
      };
      stateRef.current = next;
      return next;
    });
    mouseVelocityRef.current = { x: 0, y: 0 };

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const handlePointerEnter = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!enabledRef.current) return;
      if (isInteractiveTarget(e.target)) {
        if (e.pointerType === "mouse") stopDrawing();
        return;
      }

      if (e.pointerType === "mouse") {
        setState((prev) => {
          const next = withDrawingStart(prev, e.clientX, e.clientY);
          stateRef.current = next;
          return next;
        });
        updatePointerPos(e.clientX, e.clientY);
      }
    },
    [stopDrawing, updatePointerPos]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!enabledRef.current) return;
      if (isInteractiveTarget(e.target)) {
        if (e.pointerType === "mouse") stopDrawing();
        return;
      }

      if (e.pointerType === "mouse") {
        if (!stateRef.current.isDrawing) {
          setState((prev) => {
            const next = withDrawingStart(prev, e.clientX, e.clientY);
            stateRef.current = next;
            return next;
          });
        }
        updatePointerPos(e.clientX, e.clientY);
        return;
      }

      if (!pointerDownRef.current) return;
      updatePointerPos(e.clientX, e.clientY);
    },
    [stopDrawing, updatePointerPos]
  );

  const handlePointerLeave = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!enabledRef.current) return;
      if (e.pointerType === "mouse") stopDrawing();
    },
    [stopDrawing]
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!enabledRef.current) return;
      if (isInteractiveTarget(e.target)) return;

      if (e.pointerType !== "mouse") {
        e.preventDefault();
        pointerDownRef.current = true;
        pointerIdRef.current = e.pointerId;
        setState((prev) => {
          const next = withDrawingStart(prev, e.clientX, e.clientY);
          stateRef.current = next;
          return next;
        });
        updatePointerPos(e.clientX, e.clientY);

        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
    },
    [updatePointerPos]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse") return;

      pointerDownRef.current = false;
      pointerIdRef.current = null;

      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      if (!enabledRef.current) return;
      stopDrawing();
    },
    [stopDrawing]
  );

  const handlePointerCancel = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse") return;

      pointerDownRef.current = false;
      pointerIdRef.current = null;

      if (!enabledRef.current) return;
      stopDrawing();
    },
    [stopDrawing]
  );

  useEffect(() => {
    const animate = (currentTime: number): void => {
      if (!stateRef.current.isDrawing || !enabledRef.current) {
        animationFrameRef.current = null;
        return;
      }

      const deltaTime = currentTime - lastUpdateTimeRef.current;
      if (deltaTime < 16) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastUpdateTimeRef.current = currentTime;

      const prev = stateRef.current;
      const deltaX = prev.mousePos.x - prev.smoothMousePos.x;
      const deltaY = prev.mousePos.y - prev.smoothMousePos.y;
      const mouseSmoothness = 0.25;
      const newSmoothMousePos = {
        x: prev.smoothMousePos.x + deltaX * mouseSmoothness,
        y: prev.smoothMousePos.y + deltaY * mouseSmoothness,
      };

      const pawDeltaX = newSmoothMousePos.x - prev.pawPos.x;
      const pawDeltaY = newSmoothMousePos.y - prev.pawPos.y;
      const distance = Math.sqrt(pawDeltaX * pawDeltaX + pawDeltaY * pawDeltaY);

      const mouseSpeed = Math.sqrt(
        mouseVelocityRef.current.x ** 2 + mouseVelocityRef.current.y ** 2
      );

      let smoothness = 0.06;
      if (distance > 100) {
        smoothness = 0.15;
      } else if (distance > 50) {
        smoothness = 0.1;
      } else if (distance < 5) {
        smoothness = 0.03;
      }

      if (mouseSpeed > 10) {
        smoothness *= 1.5;
      }

      const ease = (t: number): number => 1 - Math.pow(1 - t, 3);
      const easedSmoothness = ease(smoothness);

      const newPawPos = {
        x: prev.pawPos.x + pawDeltaX * easedSmoothness,
        y: prev.pawPos.y + pawDeltaY * easedSmoothness,
      };

      const velocityX = (newPawPos.x - prev.pawPos.x) * (60 / (deltaTime !== 0 ? deltaTime : 16));
      const velocityY = (newPawPos.y - prev.pawPos.y) * (60 / (deltaTime !== 0 ? deltaTime : 16));

      if (Math.abs(pawDeltaX) > 0.1 || Math.abs(pawDeltaY) > 0.1) {
        onDrawRef.current(prev.mousePos.x, prev.mousePos.y, newSmoothMousePos.x, newSmoothMousePos.y);
      }

      const posDeltaSmall =
        Math.abs(newPawPos.x - prev.pawPos.x) < 0.25 &&
        Math.abs(newPawPos.y - prev.pawPos.y) < 0.25 &&
        Math.abs(newSmoothMousePos.x - prev.smoothMousePos.x) < 0.25 &&
        Math.abs(newSmoothMousePos.y - prev.smoothMousePos.y) < 0.25;
      const velDeltaSmall = Math.abs(velocityX) < 0.1 && Math.abs(velocityY) < 0.1;

      if (posDeltaSmall && velDeltaSmall) {
        animationFrameRef.current = null;
        return;
      }

      const next: PawAnimationState = {
        ...prev,
        smoothMousePos: newSmoothMousePos,
        pawPos: newPawPos,
        pawVelocity: { x: velocityX, y: velocityY },
      };
      stateRef.current = next;
      setState(next);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    kickAnimationRef.current = (): void => {
      if (animationFrameRef.current !== null) return;
      if (!stateRef.current.isDrawing || !enabledRef.current) return;
      lastUpdateTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (state.isDrawing && enabled) {
      kickAnimationRef.current();
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [state.isDrawing, enabled]);

  return {
    ...state,
    handlers: {
      handlePointerEnter,
      handlePointerMove,
      handlePointerLeave,
      handlePointerDown,
      handlePointerUp,
      handlePointerCancel,
    },
  };
}
