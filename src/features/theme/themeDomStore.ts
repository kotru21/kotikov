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
export function commitThemeChoice(
  choice: ThemeChoice,
  root: HTMLElement = document.documentElement
): boolean {
  const isDark = applyChoice(choice, root);
  emitThemeDom();
  return isDark;
}

export function getThemeIsDarkSnapshot(): boolean {
  return document.documentElement.classList.contains("dark");
}

export function getServerThemeIsDarkSnapshot(): boolean {
  return false;
}
