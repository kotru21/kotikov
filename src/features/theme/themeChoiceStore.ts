import type { ThemeChoice } from "./themeConstants";
import { persistChoice, readChoice } from "./themeLogic";

let choiceCache: ThemeChoice = "system";
let isChoiceHydrated = false;
const choiceListeners = new Set<() => void>();

function emitChoice(): void {
  for (const listener of choiceListeners) listener();
}

function hydrateThemeChoiceStore(): void {
  if (isChoiceHydrated) return;
  choiceCache = readChoice();
  isChoiceHydrated = true;
}

export function subscribeThemeChoice(onStoreChange: () => void): () => void {
  // Ensure storage is read before the first client snapshot after mount.
  hydrateThemeChoiceStore();
  choiceListeners.add(onStoreChange);
  return () => {
    choiceListeners.delete(onStoreChange);
  };
}

/**
 * Client snapshot. Lazily hydrates once from storage/cookie, then returns the
 * cached value (stable until writeThemeChoice / reset).
 */
export function getThemeChoiceSnapshot(): ThemeChoice {
  hydrateThemeChoiceStore();
  return choiceCache;
}

export function getServerThemeChoiceSnapshot(): ThemeChoice {
  return "system";
}

export function writeThemeChoice(next: ThemeChoice): void {
  choiceCache = next;
  isChoiceHydrated = true;
  persistChoice(next);
  emitChoice();
}

/** Test-only: clear module cache so vitest cases do not leak theme across files. */
export function resetThemeChoiceStore(): void {
  choiceCache = "system";
  isChoiceHydrated = false;
  emitChoice();
}
