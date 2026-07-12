"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import type { ThemeChoice } from "./themeConstants";
import { writeThemeCookie } from "./themeCookie";
import {
  commitThemeChoice,
  getServerThemeIsDarkSnapshot,
  getThemeIsDarkSnapshot,
  subscribeThemeDom,
} from "./themeDomStore";
import { persistChoice, readChoice } from "./themeLogic";

export type { ThemeChoice } from "./themeConstants";

interface ThemeContextValue {
  choice: ThemeChoice;
  isDark: boolean;
  setChoice: (c: ThemeChoice) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const emptyUnsubscribe = (): void => {
  /* useSyncExternalStore requires a subscribe; mount flag never changes */
};
const emptySubscribe = (): (() => void) => emptyUnsubscribe;

/** false during SSR/hydration; true on the client after hydration (no useEffect lag). */
export function useHasMounted(): boolean {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export const ThemeProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [choiceState, setChoiceState] = useState<ThemeChoice>("system");

  const isDark = useSyncExternalStore(
    subscribeThemeDom,
    getThemeIsDarkSnapshot,
    getServerThemeIsDarkSnapshot
  );

  useLayoutEffect(() => {
    const initial = readChoice();
    setChoiceState(initial);
    commitThemeChoice(initial);
    writeThemeCookie(initial);
  }, []);

  useEffect(() => {
    if (choiceState !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (): void => {
      commitThemeChoice("system");
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [choiceState]);

  const setChoice = useCallback((c: ThemeChoice): void => {
    setChoiceState(c);
    persistChoice(c);
    writeThemeCookie(c);
    commitThemeChoice(c);
  }, []);

  const toggle = useCallback((): void => {
    setChoice(document.documentElement.classList.contains("dark") ? "light" : "dark");
  }, [setChoice]);

  const value = useMemo(
    () => ({ choice: choiceState, isDark, setChoice, toggle }),
    [choiceState, isDark, setChoice, toggle]
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
