import { useState, useRef, useEffect, useCallback } from "react";

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

export const usePawAnimation = (
  onDraw: (x: number, y: number, prevX: number, prevY: number) => void
) => {
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

  const handleMouseEnter = useCallback(() => {
    setState((prev) => ({ ...prev, isDrawing: true }));
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newPos = { x: e.clientX, y: e.clientY };

    setState((prev) => {
      // Рассчитываем скорость мыши
      const deltaX = newPos.x - prev.mousePos.x;
      const deltaY = newPos.y - prev.mousePos.y;
      mouseVelocityRef.current = { x: deltaX, y: deltaY };

      return { ...prev, mousePos: newPos };
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDrawing: false,
      pawVelocity: { x: 0, y: 0 },
    }));
    mouseVelocityRef.current = { x: 0, y: 0 };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Основной цикл анимации
  useEffect(() => {
    if (!state.isDrawing) return;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastUpdateTimeRef.current;
      if (deltaTime < 16) {
        if (state.isDrawing) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
        return;
      }
      lastUpdateTimeRef.current = currentTime;

      setState((prev) => {
        // Обновляем сглаженную позицию мыши
        const deltaX = prev.mousePos.x - prev.smoothMousePos.x;
        const deltaY = prev.mousePos.y - prev.smoothMousePos.y;
        const mouseSmoothness = 0.25;
        const newSmoothMousePos = {
          x: prev.smoothMousePos.x + deltaX * mouseSmoothness,
          y: prev.smoothMousePos.y + deltaY * mouseSmoothness,
        };

        // Обновляем позицию лапы
        const pawDeltaX = newSmoothMousePos.x - prev.pawPos.x;
        const pawDeltaY = newSmoothMousePos.y - prev.pawPos.y;
        const distance = Math.sqrt(
          pawDeltaX * pawDeltaX + pawDeltaY * pawDeltaY
        );

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

        const ease = (t: number) => 1 - Math.pow(1 - t, 3);
        const easedSmoothness = ease(smoothness);

        const newPawPos = {
          x: prev.pawPos.x + pawDeltaX * easedSmoothness,
          y: prev.pawPos.y + pawDeltaY * easedSmoothness,
        };

        const velocityX =
          (newPawPos.x - prev.pawPos.x) * (60 / (deltaTime || 16));
        const velocityY =
          (newPawPos.y - prev.pawPos.y) * (60 / (deltaTime || 16));

        // Рисуем если есть заметное движение
        if (Math.abs(pawDeltaX) > 0.3 || Math.abs(pawDeltaY) > 0.3) {
          onDraw(newPawPos.x, newPawPos.y, prev.pawPos.x, prev.pawPos.y);
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

    // Инициализируем позиции при первом входе
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
      if (animationFrameRef.current) {
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
      handleMouseEnter,
      handleMouseMove,
      handleMouseLeave,
    },
  };
};
