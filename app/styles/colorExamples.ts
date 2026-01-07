import { colors, getColor, withOpacity } from "./colors";

// Примеры использования цветовой системы

// 1. Прямое обращение к цветам
export const exampleDirectUsage = {
  backgroundColor: colors.background.primary,
  color: colors.text.primary,
  borderColor: colors.border.accent,
};

// 2. Использование утилитарной функции
export const exampleUtilityUsage = {
  backgroundColor: getColor("background.primary"),
  color: getColor("text.primary"),
  accentColor: getColor("primary.500"),
};

// 3. Создание тем
export const themes = {
  dark: {
    background: colors.background.primary,
    surface: colors.background.secondary,
    text: colors.text.primary,
    textSecondary: colors.text.secondary,
    border: colors.border.dark,
    accent: colors.primary[500],
  },
  light: {
    background: colors.background.light,
    surface: colors.background.gray,
    text: colors.text.inverse,
    textSecondary: colors.neutral[600],
    border: colors.border.light,
    accent: colors.primary[600],
  },
};

// 4. Стили для компонентов
export const componentStyles = {
  button: {
    primary: {
      backgroundColor: colors.primary[600],
      color: colors.text.primary,
      hover: colors.hover.primary,
      focus: colors.focus.ring,
    },
    secondary: {
      backgroundColor: "transparent",
      color: colors.text.secondary,
      border: colors.border.DEFAULT,
      hover: colors.hover.secondary,
    },
  },

  card: {
    backgroundColor: colors.background.secondary,
    border: colors.border.dark,
    shadow: withOpacity(colors.neutral[950], 0.1),
  },

  header: {
    backgroundColor: colors.background.primary,
    text: colors.text.primary,
    link: colors.text.secondary,
    linkHover: colors.text.primary,
  },

  input: {
    backgroundColor: colors.background.tertiary,
    border: colors.border.dark,
    text: colors.text.primary,
    placeholder: colors.text.muted,
    focus: {
      border: colors.border.accent,
      ring: withOpacity(colors.focus.ring, 0.2),
    },
  },
};

// 5. Градиенты для различных элементов
export const gradientStyles = {
  hero: {
    background: colors.gradients.sunset,
  },
  button: {
    background: colors.gradients.primary,
  },
  card: {
    background: colors.gradients.ocean,
  },
};

// 6. Утилиты для создания CSS-переменных
export const createCSSVariables = (): Record<string, string> => {
  const cssVars: Record<string, string> = {};

  // Основные цвета
  Object.entries(colors.primary).forEach(([key, value]) => {
    cssVars[`--color-primary-${key}`] = value;
  });

  // Нейтральные цвета
  Object.entries(colors.neutral).forEach(([key, value]) => {
    cssVars[`--color-neutral-${key}`] = value;
  });

  // Цвета фона
  Object.entries(colors.background).forEach(([key, value]) => {
    cssVars[`--color-bg-${key}`] = value;
  });

  // Цвета текста
  Object.entries(colors.text).forEach(([key, value]) => {
    cssVars[`--color-text-${key}`] = value;
  });

  return cssVars;
};

// 7. Функция для применения темы
export const applyTheme = (theme: "dark" | "light"): void => {
  const selectedTheme = themes[theme];
  const root = document.documentElement;

  Object.entries(selectedTheme).forEach(([property, value]) => {
    root.style.setProperty(`--theme-${property}`, value);
  });
};

// 8. Responsive цвета (для разных breakpoints)
export const responsiveColors = {
  mobile: {
    header: colors.background.primary,
    nav: colors.text.primary,
  },
  desktop: {
    header: colors.background.secondary,
    nav: colors.text.secondary,
  },
};

const colorSystem = {
  colors,
  themes,
  componentStyles,
  gradientStyles,
  createCSSVariables,
  applyTheme,
  responsiveColors,
};

export default colorSystem;
