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

interface UsePawAnimationReturn extends PawAnimationState {
  handlers: PawAnimationHandlers;
}

export const usePawAnimation = (
  onDraw: (x: number, y: number, prevX: number, prevY: number) => void
): UsePawAnimationReturn => {
  const [state, setState] = useState<PawAnimationState>({
    mousePos: { x: 0, y: 0 },
    smoothMousePos: { x: 0, y: 0 },
    pawPos: { x: 0, y: 0 },
    pawVelocity: { x: 0, y: 0 },
    isDrawing: false,
  });

  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const mouseVelocityRef = useRef<MousePosition>({ x: 0, y: 0 });

  const pointerDownRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);

  const updatePointerPos = useCallback((x: number, y: number): void => {
    setState((prev) => {
      const deltaX = x - prev.mousePos.x;
      const deltaY = y - prev.mousePos.y;
      mouseVelocityRef.current = { x: deltaX, y: deltaY };
      return { ...prev, mousePos: { x, y } };
    });
  }, []);

  const stopDrawing = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDrawing: false,
      pawVelocity: { x: 0, y: 0 },
    }));
    mouseVelocityRef.current = { x: 0, y: 0 };

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const handlePointerEnter = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (isInteractiveTarget(e.target)) {
        if (e.pointerType === "mouse") stopDrawing();
        return;
      }

      // Мышь рисует по hover
      if (e.pointerType === "mouse") {
        setState((prev) => ({ ...prev, isDrawing: true }));
        updatePointerPos(e.clientX, e.clientY);
      }
    },
    [stopDrawing, updatePointerPos]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (isInteractiveTarget(e.target)) {
        if (e.pointerType === "mouse") stopDrawing();
        return;
      }

      // Мышь: рисуем только пока isDrawing (hover внутри зоны)
      if (e.pointerType === "mouse") {
        if (!state.isDrawing) {
          setState((prev) => ({ ...prev, isDrawing: true }));
        }
        updatePointerPos(e.clientX, e.clientY);
        return;
      }

      // Touch/Pen: только при зажатии
      if (!pointerDownRef.current) return;
      updatePointerPos(e.clientX, e.clientY);
    },
    [state.isDrawing, stopDrawing, updatePointerPos]
  );

  const handlePointerLeave = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      // Мышь: ушли из зоны — прекращаем
      if (e.pointerType === "mouse") {
        stopDrawing();
      }
    },
    [stopDrawing]
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (isInteractiveTarget(e.target)) return;

      // Touch/Pen: начинаем рисовать только по зажатию
      if (e.pointerType !== "mouse") {
        pointerDownRef.current = true;
        pointerIdRef.current = e.pointerId;
        setState((prev) => ({ ...prev, isDrawing: true }));
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
      stopDrawing();

      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    },
    [stopDrawing]
  );

  const handlePointerCancel = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse") return;

      pointerDownRef.current = false;
      pointerIdRef.current = null;
      stopDrawing();
    },
    [stopDrawing]
  );

  useEffect(() => {
    if (!state.isDrawing) return;

    const animate = (currentTime: number): void => {
      const deltaTime = currentTime - lastUpdateTimeRef.current;
      if (deltaTime < 16) {
        if (state.isDrawing) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
        return;
      }
      lastUpdateTimeRef.current = currentTime;

      setState((prev) => {
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
          onDraw(prev.mousePos.x, prev.mousePos.y, newSmoothMousePos.x, newSmoothMousePos.y);
        }

        // Минимальные пороги, чтобы не вызывать лишние рендеры
        const posDeltaSmall =
          Math.abs(newPawPos.x - prev.pawPos.x) < 0.25 &&
          Math.abs(newPawPos.y - prev.pawPos.y) < 0.25 &&
          Math.abs(newSmoothMousePos.x - prev.smoothMousePos.x) < 0.25 &&
          Math.abs(newSmoothMousePos.y - prev.smoothMousePos.y) < 0.25;
        const velDeltaSmall = Math.abs(velocityX) < 0.1 && Math.abs(velocityY) < 0.1;

        if (posDeltaSmall && velDeltaSmall) {
          // возвращаем предыдущее состояние без изменений — React не перерендерит
          return prev;
        }

        return {
          ...prev,
          smoothMousePos: newSmoothMousePos,
          pawPos: newPawPos,
          pawVelocity: { x: velocityX, y: velocityY },
        };
      });

      if (state.isDrawing) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (state.pawPos.x === 0 && state.pawPos.y === 0) {
      setState((prev) => ({
        ...prev,
        pawPos: prev.mousePos,
        smoothMousePos: prev.mousePos,
      }));
      lastUpdateTimeRef.current = performance.now();
    }

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    state.isDrawing,
    state.mousePos,
    state.smoothMousePos,
    state.pawPos.x,
    state.pawPos.y,
    onDraw,
  ]);

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
};
