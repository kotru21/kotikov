import { useRef, useCallback } from "react";

/**
 * Хук для создания debounced функции
 * @param callback - функция для выполнения с задержкой
 * @param delay - задержка в миллисекундах
 * @returns debounced версия функции
 */
export const useDebounce = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
};

/**
 * Хук для создания throttled функции с использованием requestAnimationFrame
 * @param callback - функция для выполнения
 * @returns throttled версия функции
 */
export const useRafThrottle = <T extends (...args: unknown[]) => unknown>(
  callback: T
): ((...args: Parameters<T>) => void) => {
  const rafRef = useRef<number | null>(null);
  const argsRef = useRef<Parameters<T> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      argsRef.current = args;

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          if (argsRef.current) {
            callback(...argsRef.current);
          }
          rafRef.current = null;
        });
      }
    },
    [callback]
  );
};
