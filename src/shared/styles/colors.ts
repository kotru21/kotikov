// Цветовая палитра для портфолио (Bauhaus Style)
export const colors = {
  // Основные цвета
  primary: {
    50: "#fff5f5",
    100: "#fed7d7",
    200: "#feb2b2",
    300: "#fc8181",
    400: "#f56565",
    500: "#d12c1f", // Bauhaus Red
    600: "#c53030",
    700: "#9b2c2c",
    800: "#822727",
    900: "#63171b",
    950: "#450a0a",
  },

  // Нейтральные цвета
  neutral: {
    50: "#f5f5f3", // Bauhaus Paper
    100: "#eeeeee",
    200: "#e0e0e0",
    300: "#bdbdbd",
    400: "#9e9e9e",
    500: "#757575",
    600: "#616161",
    700: "#424242",
    800: "#212121",
    900: "#111111", // Nearly Black
    950: "#050505",
  },

  // Акцентные цвета
  accent: {
    pink: {
      400: "#f687b3",
      500: "#ed64a6",
      600: "#d53f8c",
    },
    purple: {
      400: "#9f7aea",
      500: "#805ad5",
      600: "#1b54a7", // Bauhaus Blue replacement
    },
    blue: {
      400: "#63b3ed",
      500: "#1b54a7", // Bauhaus Blue
      600: "#2b6cb0",
    },
    yellow: {
      500: "#f4bf21", // Bauhaus Yellow
    }
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
      DEFAULT: "#f4bf21", // Bauhaus Yellow
      dark: "#b45309",
    },
    error: {
      light: "#fee2e2",
      DEFAULT: "#d12c1f", // Bauhaus Red
      dark: "#7f1d1d",
    },
    info: {
      light: "#dbeafe",
      DEFAULT: "#1b54a7", // Bauhaus Blue
      dark: "#1e3a8a",
    },
  },

  // Градиенты
  gradients: {
    primary: "linear-gradient(135deg, #d12c1f 0%, #1b54a7 100%)",
    sunset: "linear-gradient(135deg, #d12c1f 0%, #f4bf21 100%)",
    ocean: "linear-gradient(135deg, #1b54a7 0%, #171717 100%)",
    forest: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    fire: "linear-gradient(135deg, #f4bf21 0%, #d12c1f 100%)",
  },

  // Цвета фона
  background: {
    primary: "#f5f5f3", // Paper White
    secondary: "#ffffff",
    tertiary: "#111111",
    accent: "#f4bf21",
    light: "#ffffff",
    gray: "#eeeeee",
  },

  // Цвета текста
  text: {
    primary: "#111111", // Black
    secondary: "#424242",
    tertiary: "#616161",
    muted: "#757575",
    inverse: "#f5f5f3",
    accent: "#d12c1f",
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
