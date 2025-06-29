import { useEffect, useState, useCallback } from "react";

export const useIsMobile = (breakpoint: number = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  const checkIsMobile = useCallback(() => {
    setIsMobile(window.innerWidth < breakpoint);
  }, [breakpoint]);

  useEffect(() => {
    checkIsMobile();

    let timeoutId: NodeJS.Timeout;

    // Debounced обработчик resize для предотвращения частых вызовов
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIsMobile, 150); // Задержка 150ms
    };

    // Добавляем слушатель изменения размера окна
    window.addEventListener("resize", debouncedResize, { passive: true });

    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [checkIsMobile]);

  return isMobile;
};
