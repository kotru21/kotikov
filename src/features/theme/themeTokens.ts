import { colors } from "@/styles/colors";

/**
 * Canvas colors for critical CSS, viewport theme-color, and manifest.
 * Dark values must stay aligned with dark-mode.css --background / --foreground.
 */
export const THEME_SURFACE = {
  light: {
    background: colors.background.primary,
    foreground: colors.text.primary,
  },
  dark: {
    background: colors.background.dark,
    foreground: colors.text.onDark,
  },
} as const;
