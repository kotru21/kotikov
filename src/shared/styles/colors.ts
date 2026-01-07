// Цветовая палитра для портфолио (Bauhaus Style)
export const colors = {
  // Основные цвета (акцентный scale бренда)
  // Базовый акцент: #00ffb9
  primary: {
    50: "#eafff8",
    100: "#c9fff0",
    200: "#9effe4",
    300: "#63ffd5",
    400: "#2cffc7",
    500: "#00ffb9", 
    600: "#00d99d",
    700: "#00b583",
    800: "#008f67",
    900: "#006a4d",
    950: "#003829",
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

  // Акцентные цвета (единая система оттенков #00ffb9)
  // Используйте этот раздел для всего, что раньше было "красным/жёлтым/синим" акцентом.
  accent: {
    50: "#eafff8",
    100: "#c9fff0",
    200: "#9effe4",
    300: "#63ffd5",
    400: "#2cffc7",
    500: "#00ffb9",
    600: "#00d99d",
    700: "#00b583",
    800: "#008f67",
    900: "#006a4d",
    950: "#003829",
    // Пары для контраста (WCAG-friendly дефолты)
    fg: "#111111", // текст/иконки на светлом accent фоне
    fgInverse: "#f5f5f3", // текст/иконки на очень тёмном accent фоне
    glow: "#00ffb9",
  },

  // Семантические цвета
  semantic: {
    success: {
      light: "#eafff8",
      DEFAULT: "#00d99d",
      dark: "#006a4d",
    },
    warning: {
      light: "#c9fff0",
      DEFAULT: "#00ffb9",
      dark: "#008f67",
    },
    error: {
      light: "#9effe4",
      DEFAULT: "#00b583",
      dark: "#006a4d",
    },
    info: {
      light: "#eafff8",
      DEFAULT: "#00d99d",
      dark: "#008f67",
    },
  },

  // Градиенты
  gradients: {
    primary: "linear-gradient(135deg, #00ffb9 0%, #008f67 100%)",
    sunset: "linear-gradient(135deg, #63ffd5 0%, #00ffb9 100%)",
    ocean: "linear-gradient(135deg, #00d99d 0%, #171717 100%)",
    forest: "linear-gradient(135deg, #00ffb9 0%, #00b583 100%)",
    fire: "linear-gradient(135deg, #2cffc7 0%, #008f67 100%)",
  },

  // Цвета фона
  background: {
    primary: "#f5f5f3", // Paper White
    secondary: "#ffffff",
    tertiary: "#111111",
    accent: "#9effe4",
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
    accent: "#008f67",
  },


  // Цвета границ
  border: {
    light: "#e5e5e5",
    DEFAULT: "#d4d4d4",
    dark: "#525252",
    accent: "#00d99d",
  },

  // Hover состояния
  hover: {
    primary: "#00b583",
    secondary: "#404040",
    accent: "#00d99d",
    light: "#f5f5f5",
  },

  // Focus состояния
  focus: {
    ring: "#00d99d",
    background: "#eafff8",
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
  let result: unknown = colors;

  for (const key of keys) {
    if (result !== null && typeof result === "object" && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      console.warn(`Color path "${path}" not found`);
      return "#000000";
    }
  }

  if (typeof result === "string") {
    return result;
  }

  console.warn(`Color path "${path}" is not a string`);
  return "#000000";
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
    return `rgba(${String(r)}, ${String(g)}, ${String(b)}, ${String(opacity)})`;
  }

  // Если цвет уже в rgb/rgba формате
  if (color.startsWith("rgb")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${String(opacity)})`);
  }

  return color;
};

export default colors;
