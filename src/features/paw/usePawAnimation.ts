"use client";

import { type PointerEvent, useCallback, useEffect, useRef, useState } from "react";

import { isActivatableControl, isInteractiveTarget } from "@/shared/lib";

interface MousePosition {
  x: number;
  y: number;
}

interface PawMotionState {
  mousePos: MousePosition;
  smoothMousePos: MousePosition;
  /** Internal lag target for RAF settle (not a visible cursor). */
  lagPos: MousePosition;
  lagVelocity: MousePosition;
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

interface UsePawAnimationReturn {
  isDrawing: boolean;
  handlers: PawAnimationHandlers;
}

const INITIAL_MOTION: PawMotionState = {
  mousePos: { x: 0, y: 0 },
  smoothMousePos: { x: 0, y: 0 },
  lagPos: { x: 0, y: 0 },
  lagVelocity: { x: 0, y: 0 },
  isDrawing: false,
};

function withDrawingStart(prev: PawMotionState, x: number, y: number): PawMotionState {
  const needsOrigin = prev.lagPos.x === 0 && prev.lagPos.y === 0;
  return {
    ...prev,
    isDrawing: true,
    mousePos: { x, y },
    ...(needsOrigin
      ? {
          lagPos: { x, y },
          smoothMousePos: { x, y },
        }
      : {}),
  };
}

function releasePointerCapture(target: HTMLElement, pointerId: number): void {
  try {
    target.releasePointerCapture(pointerId);
  } catch {
    // ignore
  }
}

export function usePawAnimation(
  onDraw: (x: number, y: number, prevX: number, prevY: number) => void,
  options: UsePawAnimationOptions = {}
): UsePawAnimationReturn {
  const enabled = options.enabled ?? true;

  // Only isDrawing is React state — smooth/lag/mouse live in refs to avoid ~60fps re-renders.
  const [isDrawing, setIsDrawing] = useState(false);
  const enabledRef = useRef(enabled);
  const motionRef = useRef<PawMotionState>(INITIAL_MOTION);
  const onDrawRef = useRef(onDraw);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    onDrawRef.current = onDraw;
  }, [onDraw]);

  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef(0);
  const mouseVelocityRef = useRef({ x: 0, y: 0 });
  const pointerDownRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const kickAnimationRef = useRef<() => void>(() => undefined);

  // Adjust React state during render when drawing is disabled (not in an effect).
  if (!enabled && isDrawing) {
    setIsDrawing(false);
  }

  useEffect(() => {
    if (enabled) return;
    motionRef.current = {
      ...motionRef.current,
      isDrawing: false,
      lagVelocity: { x: 0, y: 0 },
    };
    mouseVelocityRef.current = { x: 0, y: 0 };
    pointerDownRef.current = false;
    pointerIdRef.current = null;
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [enabled]);

  const updatePointerPos = useCallback((x: number, y: number): void => {
    const prev = motionRef.current;
    mouseVelocityRef.current = { x: x - prev.mousePos.x, y: y - prev.mousePos.y };
    motionRef.current = { ...prev, mousePos: { x, y } };
    kickAnimationRef.current();
  }, []);

  const startDrawingAt = useCallback(
    (x: number, y: number): void => {
      motionRef.current = withDrawingStart(motionRef.current, x, y);
      setIsDrawing(true);
      updatePointerPos(x, y);
    },
    [updatePointerPos]
  );

  const stopDrawing = useCallback(() => {
    motionRef.current = {
      ...motionRef.current,
      isDrawing: false,
      lagVelocity: { x: 0, y: 0 },
    };
    setIsDrawing(false);
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
        startDrawingAt(e.clientX, e.clientY);
      }
    },
    [startDrawingAt, stopDrawing]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!enabledRef.current) return;
      if (isInteractiveTarget(e.target)) {
        if (e.pointerType === "mouse") stopDrawing();
        return;
      }

      if (e.pointerType === "mouse") {
        if (!motionRef.current.isDrawing) {
          startDrawingAt(e.clientX, e.clientY);
          return;
        }
        updatePointerPos(e.clientX, e.clientY);
        return;
      }

      if (!pointerDownRef.current) return;
      updatePointerPos(e.clientX, e.clientY);
    },
    [startDrawingAt, stopDrawing, updatePointerPos]
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
      // Keep mouse paint-through on data-draw-allow controls; never steal touch clicks.
      if (e.pointerType !== "mouse" && isActivatableControl(e.target)) return;

      if (e.pointerType !== "mouse") {
        // Do not preventDefault here: pan-y must keep working until a draw move.
        pointerDownRef.current = true;
        pointerIdRef.current = e.pointerId;
        startDrawingAt(e.clientX, e.clientY);

        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
    },
    [startDrawingAt]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse") return;

      pointerDownRef.current = false;
      pointerIdRef.current = null;
      releasePointerCapture(e.currentTarget, e.pointerId);

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
      releasePointerCapture(e.currentTarget, e.pointerId);

      if (!enabledRef.current) return;
      stopDrawing();
    },
    [stopDrawing]
  );

  useEffect(() => {
    const animate = (currentTime: number): void => {
      if (!motionRef.current.isDrawing || !enabledRef.current) {
        animationFrameRef.current = null;
        return;
      }

      const deltaTime = currentTime - lastUpdateTimeRef.current;
      if (deltaTime < 16) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastUpdateTimeRef.current = currentTime;

      const prev = motionRef.current;
      const deltaX = prev.mousePos.x - prev.smoothMousePos.x;
      const deltaY = prev.mousePos.y - prev.smoothMousePos.y;
      const mouseSmoothness = 0.25;
      const newSmoothMousePos = {
        x: prev.smoothMousePos.x + deltaX * mouseSmoothness,
        y: prev.smoothMousePos.y + deltaY * mouseSmoothness,
      };

      const lagDeltaX = newSmoothMousePos.x - prev.lagPos.x;
      const lagDeltaY = newSmoothMousePos.y - prev.lagPos.y;
      const distance = Math.sqrt(lagDeltaX * lagDeltaX + lagDeltaY * lagDeltaY);

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

      const newLagPos = {
        x: prev.lagPos.x + lagDeltaX * easedSmoothness,
        y: prev.lagPos.y + lagDeltaY * easedSmoothness,
      };

      const velocityX = (newLagPos.x - prev.lagPos.x) * (60 / (deltaTime !== 0 ? deltaTime : 16));
      const velocityY = (newLagPos.y - prev.lagPos.y) * (60 / (deltaTime !== 0 ? deltaTime : 16));

      if (Math.abs(lagDeltaX) > 0.1 || Math.abs(lagDeltaY) > 0.1) {
        onDrawRef.current(prev.mousePos.x, prev.mousePos.y, newSmoothMousePos.x, newSmoothMousePos.y);
      }

      const posDeltaSmall =
        Math.abs(newLagPos.x - prev.lagPos.x) < 0.25 &&
        Math.abs(newLagPos.y - prev.lagPos.y) < 0.25 &&
        Math.abs(newSmoothMousePos.x - prev.smoothMousePos.x) < 0.25 &&
        Math.abs(newSmoothMousePos.y - prev.smoothMousePos.y) < 0.25;
      const velDeltaSmall = Math.abs(velocityX) < 0.1 && Math.abs(velocityY) < 0.1;

      motionRef.current = {
        ...prev,
        smoothMousePos: newSmoothMousePos,
        lagPos: newLagPos,
        lagVelocity: { x: velocityX, y: velocityY },
      };

      if (posDeltaSmall && velDeltaSmall) {
        animationFrameRef.current = null;
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    kickAnimationRef.current = (): void => {
      if (animationFrameRef.current !== null) return;
      if (!motionRef.current.isDrawing || !enabledRef.current) return;
      lastUpdateTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (isDrawing && enabled) {
      kickAnimationRef.current();
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isDrawing, enabled]);

  return {
    isDrawing,
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
