import { useState, useEffect } from "react";

interface PerformanceSettings {
  reducedMotion: boolean;
  lowPerformance: boolean;
  highRefreshRate: boolean;
}

/**
 * Хук для определения настроек производительности пользователя
 * @returns объект с настройками производительности
 */
export const usePerformanceSettings = (): PerformanceSettings => {
  const [settings, setSettings] = useState<PerformanceSettings>({
    reducedMotion: false,
    lowPerformance: false,
    highRefreshRate: false,
  });

  useEffect(() => {
    const detectSettings = () => {
      // Проверяем предпочтения пользователя по анимациям
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Простая детекция низкой производительности на основе параметров устройства
      const deviceMemory = (navigator as { deviceMemory?: number })
        .deviceMemory;
      const lowPerformance =
        navigator.hardwareConcurrency <= 2 || // Мало ядер процессора
        (deviceMemory !== undefined && deviceMemory <= 4) || // Мало ОЗУ (если доступно)
        navigator.userAgent.includes("Mobile"); // Мобильное устройство

      // Детекция высокой частоты обновления (упрощенная)
      let highRefreshRate = false;
      try {
        // Попытаемся использовать requestAnimationFrame для определения частоты
        const start = performance.now();
        let frameCount = 0;

        const measureFrameRate = (timestamp: number) => {
          frameCount++;
          if (timestamp - start > 1000) {
            highRefreshRate = frameCount > 80; // Если больше 80 FPS, считаем высокой частотой
          } else if (frameCount < 10) {
            requestAnimationFrame(measureFrameRate);
          }
        };

        requestAnimationFrame(measureFrameRate);
      } catch {
        highRefreshRate = false;
      }

      setSettings({
        reducedMotion,
        lowPerformance,
        highRefreshRate,
      });
    };

    detectSettings();

    // Слушаем изменения предпочтений по анимациям
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => detectSettings();

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return settings;
};
