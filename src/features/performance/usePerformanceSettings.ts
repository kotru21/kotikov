"use client";

import { useEffect, useState } from "react";

interface PerformanceSettings {
  reducedMotion: boolean;
  lowPerformance: boolean;
}

export const usePerformanceSettings = (): PerformanceSettings => {
  const [settings, setSettings] = useState<PerformanceSettings>({
    reducedMotion: false,
    lowPerformance: false,
  });

  useEffect(() => {
    const detectSettings = (): void => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory;
      const lowPerformance =
        navigator.hardwareConcurrency <= 2 ||
        (deviceMemory !== undefined && deviceMemory <= 4);

      setSettings({
        reducedMotion,
        lowPerformance,
      });
    };

    detectSettings();

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (): void => {
      detectSettings();
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return settings;
};
