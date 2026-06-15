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

export type ThemeChoice = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function readChoice(): ThemeChoice {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "system";
}

function applyChoice(choice: ThemeChoice): boolean {
  const dark = choice === "dark" || (choice === "system" && systemPrefersDark());
  document.documentElement.classList.toggle("dark", dark);
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
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, c);
    }
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
