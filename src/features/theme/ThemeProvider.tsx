"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { THEME_STORAGE_KEY, type ThemeChoice } from "./themeConstants";
import { readThemeCookie, writeThemeCookie } from "./themeCookie";

export type { ThemeChoice } from "./themeConstants";

function systemPrefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readChoice(): ThemeChoice {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  const fromCookie = readThemeCookie();
  if (fromCookie !== null) return fromCookie;
  return "system";
}

function resolveIsDark(choice: ThemeChoice): boolean {
  if (choice === "light") return false;
  if (choice === "dark") return true;
  return systemPrefersDark();
}

function applyChoice(choice: ThemeChoice): boolean {
  const root = document.documentElement;
  root.classList.remove("dark", "light");

  if (choice === "light") {
    root.classList.add("light");
    return false;
  }

  const dark = resolveIsDark(choice);
  root.classList.toggle("dark", dark);
  return dark;
}

interface ThemeContextValue {
  choice: ThemeChoice;
  isDark: boolean;
  setChoice: (c: ThemeChoice) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [choiceState, setChoiceState] = useState<ThemeChoice>("system");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const initial = readChoice();
    setChoiceState(initial);
    setIsDark(applyChoice(initial));
    writeThemeCookie(initial);
  }, []);

  useEffect(() => {
    if (choiceState !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (): void => {
      setIsDark(applyChoice("system"));
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [choiceState]);

  const setChoice = useCallback((c: ThemeChoice): void => {
    setChoiceState(c);
    if (c === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, c);
    }
    writeThemeCookie(c);
    setIsDark(applyChoice(c));
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
