import type { ThemeChoice } from "./themeConstants";
import { applyChoice } from "./themeLogic";

type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeThemeDom(onStoreChange: Listener): () => void {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function emitThemeDom(): void {
  for (const listener of listeners) listener();
}

/** Apply theme classes and notify useSyncExternalStore subscribers synchronously. */
export function commitThemeChoice(choice: ThemeChoice, root?: HTMLElement): boolean {
  if (typeof document === "undefined") return false;

  const isDark = applyChoice(choice, root ?? document.documentElement);
  emitThemeDom();
  return isDark;
}

export function getThemeIsDarkSnapshot(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export function getServerThemeIsDarkSnapshot(): boolean {
  return false;
}
