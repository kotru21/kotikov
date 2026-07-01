import type { Config } from "tailwindcss";

import { colors } from "./src/shared/styles/colors.ts";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        neutral: colors.neutral,
        accent: colors.accent,
        semantic: {
          success: colors.semantic.success,
          warning: colors.semantic.warning,
          error: colors.semantic.error,
          info: colors.semantic.info,
        },
        background: colors.background,
        text: colors.text,
        border: colors.border,
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
