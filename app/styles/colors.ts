// Цветовая палитра для портфолио
export const colors = {
  // Основные цвета
  primary: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1", // Основной индиго
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#1e1b4b",
  },

  // Нейтральные цвета
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },

  // Акцентные цвета
  accent: {
    pink: {
      400: "#f472b6",
      500: "#ec4899",
      600: "#db2777",
    },
    purple: {
      400: "#c084fc",
      500: "#a855f7",
      600: "#9333ea",
    },
    blue: {
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
    },
  },

  // Семантические цвета
  semantic: {
    success: {
      light: "#dcfce7",
      DEFAULT: "#16a34a",
      dark: "#14532d",
    },
    warning: {
      light: "#fef3c7",
      DEFAULT: "#f59e0b",
      dark: "#92400e",
    },
    error: {
      light: "#fee2e2",
      DEFAULT: "#dc2626",
      dark: "#7f1d1d",
    },
    info: {
      light: "#dbeafe",
      DEFAULT: "#2563eb",
      dark: "#1e3a8a",
    },
  },

  // Градиенты
  gradients: {
    primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    sunset: "linear-gradient(135deg, #ff80b5 0%, #9089fc 100%)",
    ocean: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
    forest: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    fire: "linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)",
  },

  // Цвета фона
  background: {
    primary: "#000000",
    secondary: "#0a0a0a",
    tertiary: "#171717",
    accent: "#262626",
    light: "#ffffff",
    gray: "#f5f5f5",
  },

  // Цвета текста
  text: {
    primary: "#ffffff",
    secondary: "#e5e5e5",
    tertiary: "#a3a3a3",
    muted: "#737373",
    inverse: "#171717",
    accent: "#6366f1",
  },

  // Цвета границ
  border: {
    light: "#e5e5e5",
    DEFAULT: "#d4d4d4",
    dark: "#525252",
    accent: "#6366f1",
  },

  // Hover состояния
  hover: {
    primary: "#4f46e5",
    secondary: "#404040",
    accent: "#ec4899",
    light: "#f5f5f5",
  },

  // Focus состояния
  focus: {
    ring: "#6366f1",
    background: "#eef2ff",
  },
} as const;

// Типы для TypeScript
export type ColorPalette = typeof colors;
export type PrimaryColors = keyof typeof colors.primary;
export type NeutralColors = keyof typeof colors.neutral;
export type AccentColors = keyof typeof colors.accent;
export type SemanticColors = keyof typeof colors.semantic;

// Утилитарные функции для работы с цветами
export const getColor = (path: string): string => {
  const keys = path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = colors;

  for (const key of keys) {
    result = result[key];
    if (result === undefined) {
      console.warn(`Color path "${path}" not found`);
      return "#000000";
    }
  }

  return result as string;
};

// Функция для получения контрастного цвета
export const getContrastColor = (backgroundColor: string): string => {
  // Простая логика для определения контрастного цвета
  const darkColors: string[] = [
    colors.background.primary,
    colors.background.secondary,
    colors.background.tertiary,
    colors.neutral[800],
    colors.neutral[900],
    colors.neutral[950],
  ];

  if (darkColors.includes(backgroundColor)) {
    return colors.text.primary;
  }

  return colors.text.inverse;
};

// Функция для создания rgba цвета с прозрачностью
export const withOpacity = (color: string, opacity: number): string => {
  // Если цвет в hex формате
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Если цвет уже в rgb/rgba формате
  if (color.startsWith("rgb")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
  }

  return color;
};

export default colors;
