import { Theme } from "@/types";

export const lightTheme: Theme = {
  name: "light",
  colors: {
    primary: "#ed7550",
    secondary: "#6c757d",
    background: "#ffffff",
    surface: "#f8f9fa",
    text: "#212529",
    accent: "#007bff",
  },
};

export const darkTheme: Theme = {
  name: "dark",
  colors: {
    primary: "#ed7550",
    secondary: "#adb5bd",
    background: "#121212",
    surface: "#1e1e1e",
    text: "#ffffff",
    accent: "#0d6efd",
  },
};

export const getTheme = (themeName: Theme["name"]): Theme => {
  return themeName === "dark" ? darkTheme : lightTheme;
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
};

export const getStoredTheme = (): Theme["name"] => {
  if (typeof window === "undefined") return "light";

  const stored = localStorage.getItem("theme") as Theme["name"] | null;
  if (stored && (stored === "light" || stored === "dark")) {
    return stored;
  }

  // Определяем предпочтение пользователя
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

export const storeTheme = (theme: Theme["name"]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("theme", theme);
  }
};
