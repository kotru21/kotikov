"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeContextType, Theme } from "@/types";
import { getTheme, applyTheme, getStoredTheme, storeTheme } from "@/lib/theme";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme["name"]>("light");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Используем setTimeout чтобы избежать гидратации SSR проблем
    const timer = setTimeout(() => {
      const storedTheme = getStoredTheme();
      setTheme(storedTheme);
      applyTheme(getTheme(storedTheme));
      setIsLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    storeTheme(newTheme);
    applyTheme(getTheme(newTheme));
  };
  const isDark = theme === "dark";

  // Всегда возвращаем провайдер, но контролируем видимость
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      <div
        className={`theme-${theme}`}
        data-theme={theme}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
