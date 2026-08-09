"use client";

import { useSyncExternalStore } from "react";

interface PerformanceSettings {
  reducedMotion: boolean;
  lowPerformance: boolean;
}

const DEFAULT_SETTINGS: PerformanceSettings = {
  reducedMotion: false,
  lowPerformance: false,
};

let cachedClientSettings: PerformanceSettings = DEFAULT_SETTINGS;

function readPerformanceSettings(): PerformanceSettings {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory;
  const lowPerformance =
    navigator.hardwareConcurrency <= 2 || (deviceMemory !== undefined && deviceMemory <= 4);

  if (
    cachedClientSettings.reducedMotion === reducedMotion &&
    cachedClientSettings.lowPerformance === lowPerformance
  ) {
    return cachedClientSettings;
  }

  cachedClientSettings = { reducedMotion, lowPerformance };
  return cachedClientSettings;
}

function subscribe(onStoreChange: () => void): () => void {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handleChange = (): void => {
    onStoreChange();
  };
  mediaQuery.addEventListener("change", handleChange);
  return () => {
    mediaQuery.removeEventListener("change", handleChange);
  };
}

export const usePerformanceSettings = (): PerformanceSettings =>
  useSyncExternalStore(subscribe, readPerformanceSettings, () => DEFAULT_SETTINGS);
