"use client";

import { useEffect,useState } from "react";

interface PerformanceSettings {
  reducedMotion: boolean;
  lowPerformance: boolean;
  highRefreshRate: boolean;
}

export const usePerformanceSettings = (): PerformanceSettings => {
  const [settings, setSettings] = useState<PerformanceSettings>({
    reducedMotion: false,
    lowPerformance: false,
    highRefreshRate: false,
  });

  useEffect(() => {
    const detectSettings = (): void => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const deviceMemory = (navigator as { deviceMemory?: number })
        .deviceMemory;
      const lowPerformance =
        navigator.hardwareConcurrency <= 2 ||
        (deviceMemory !== undefined && deviceMemory <= 4) ||
        navigator.userAgent.includes("Mobile");

      let highRefreshRate = false;
      try {
        const start = performance.now();
        let frameCount = 0;

        const measureFrameRate = (timestamp: number): void => {
          frameCount++;
          if (timestamp - start > 1000) {
            highRefreshRate = frameCount > 80;
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

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (): void => { detectSettings(); };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return settings;
};
