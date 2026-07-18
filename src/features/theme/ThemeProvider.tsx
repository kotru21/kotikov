"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import {
  getServerThemeChoiceSnapshot,
  getThemeChoiceSnapshot,
  subscribeThemeChoice,
  writeThemeChoice,
} from "./themeChoiceStore";
import type { ThemeChoice } from "./themeConstants";
import { writeThemeCookie } from "./themeCookie";
import {
  commitThemeChoice,
  getServerThemeIsDarkSnapshot,
  getThemeIsDarkSnapshot,
  subscribeThemeDom,
} from "./themeDomStore";

export type { ThemeChoice } from "./themeConstants";

interface ThemeContextValue {
  choice: ThemeChoice;
  isDark: boolean;
  setChoice: (c: ThemeChoice) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  "use no memo";

  const choice = useSyncExternalStore(
    subscribeThemeChoice,
    getThemeChoiceSnapshot,
    getServerThemeChoiceSnapshot
  );

  // Follow the DOM class set by the blocking init script (and later commits).
  // Do not derive from matchMedia alone — that fights FOUC and can stick on the
  // SSR getServerSnapshot(false) path under the React Compiler.
  const isDark = useSyncExternalStore(
    subscribeThemeDom,
    getThemeIsDarkSnapshot,
    getServerThemeIsDarkSnapshot
  );

  // Single owner for DOM class + cookie; store only persists choice + notifies.
  useLayoutEffect(() => {
    commitThemeChoice(choice);
    writeThemeCookie(choice);
  }, [choice]);

  useEffect(() => {
    if (choice !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (): void => {
      commitThemeChoice("system");
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [choice]);

  const setChoice = useCallback((next: ThemeChoice): void => {
    writeThemeChoice(next);
  }, []);

  const toggle = useCallback((): void => {
    writeThemeChoice(isDark ? "light" : "dark");
  }, [isDark]);

  const value = useMemo(
    () => ({ choice, isDark, setChoice, toggle }),
    [choice, isDark, setChoice, toggle]
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
