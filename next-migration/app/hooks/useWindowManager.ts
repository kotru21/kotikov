import { useState, useCallback, useMemo, useEffect } from "react";
import { WindowPosition, WindowPositions } from "../components/windows/types";

interface DragState {
  isDragging: boolean;
  dragOffset: WindowPosition;
  draggedWindow: string | null;
}

export function useWindowManager() {
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [windowPositions, setWindowPositions] = useState<WindowPositions>({});
  const [savedPositions, setSavedPositions] = useState<WindowPositions>({});

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    draggedWindow: null,
  });
  const getCenterPosition = useMemo(() => {
    if (typeof window === "undefined") return { x: 50, y: 50 };

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const appWindowWidth = windowWidth * 0.8;
    const appWindowHeight = windowHeight * 0.8;

    return {
      x: Math.max(20, (windowWidth - appWindowWidth) / 2),
      y: Math.max(20, (windowHeight - appWindowHeight) / 2),
    };
  }, []);

  // Отслеживание изменения размера окна для пересчета позиций
  useEffect(() => {
    const handleResize = () => {
      if (Object.keys(windowPositions).length > 0) {
        // Пересчитываем позиции окон при изменении размера экрана
        const newCenterPosition = getCenterPosition;
        setWindowPositions((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((windowId) => {
            // Проверяем, что окно не выходит за границы экрана
            if (
              updated[windowId].x + window.innerWidth * 0.8 >
              window.innerWidth
            ) {
              updated[windowId] = newCenterPosition;
            }
            if (
              updated[windowId].y + window.innerHeight * 0.8 >
              window.innerHeight
            ) {
              updated[windowId] = newCenterPosition;
            }
          });
          return updated;
        });
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [windowPositions, getCenterPosition]);
  const openWindow = useCallback(
    (windowId: string) => {
      // Сначала устанавливаем позицию
      if (savedPositions[windowId]) {
        setWindowPositions((prev) => ({
          ...prev,
          [windowId]: savedPositions[windowId],
        }));
      } else if (!windowPositions[windowId]) {
        setWindowPositions((prev) => ({
          ...prev,
          [windowId]: getCenterPosition,
        }));
      }

      // Затем показываем окно с небольшой задержкой
      requestAnimationFrame(() => {
        setActiveWindow(windowId);
      });
    },
    [savedPositions, windowPositions, getCenterPosition]
  );

  const closeWindow = useCallback(() => {
    if (activeWindow && windowPositions[activeWindow]) {
      setSavedPositions((prev) => ({
        ...prev,
        [activeWindow]: windowPositions[activeWindow],
      }));
    }
    setActiveWindow(null);
  }, [activeWindow, windowPositions]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, windowId: string) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".app-window-header")) return;

      const windowPos = windowPositions[windowId] || getCenterPosition;

      setDragState({
        isDragging: true,
        draggedWindow: windowId,
        dragOffset: {
          x: e.clientX - windowPos.x,
          y: e.clientY - windowPos.y,
        },
      });
    },
    [windowPositions, getCenterPosition]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragState.isDragging || !dragState.draggedWindow) return;

      const newX = e.clientX - dragState.dragOffset.x;
      const newY = e.clientY - dragState.dragOffset.y;

      setWindowPositions((prev) => ({
        ...prev,
        [dragState.draggedWindow!]: { x: newX, y: newY },
      }));
    },
    [dragState]
  );

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedWindow: null,
      dragOffset: { x: 0, y: 0 },
    });
  }, []);

  return {
    activeWindow,
    windowPositions,
    dragState,
    getCenterPosition,
    openWindow,
    closeWindow,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
