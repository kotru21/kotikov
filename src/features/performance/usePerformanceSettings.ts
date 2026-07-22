"use client";

import { useEffect, useState } from "react";

interface PerformanceSettings {
  reducedMotion: boolean;
  lowPerformance: boolean;
}

const DEFAULT_SETTINGS: PerformanceSettings = {
  reducedMotion: false,
  lowPerformance: false,
};

function readPerformanceSettings(): PerformanceSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory;
  const lowPerformance =
    navigator.hardwareConcurrency <= 2 || (deviceMemory !== undefined && deviceMemory <= 4);

  return { reducedMotion, lowPerformance };
}

export const usePerformanceSettings = (): PerformanceSettings => {
  const [settings, setSettings] = useState<PerformanceSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const detectSettings = (): void => {
      setSettings(readPerformanceSettings());
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
