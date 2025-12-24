import type { Config } from "tailwindcss";
import { colors } from "./src/shared/styles/colors.js";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        neutral: colors.neutral,
        accent: {
          pink: colors.accent.pink,
          purple: colors.accent.purple,
          blue: colors.accent.blue,
        },
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
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-in-left": "slide-in-left 0.6s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translate3d(0, 30px, 0)",
          },
          "100%": {
            opacity: "1",
            transform: "translate3d(0, 0, 0)",
          },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-left": {
          "0%": {
            opacity: "0",
            transform: "translate3d(-50px, 0, 0)",
          },
          "100%": {
            opacity: "1",
            transform: "translate3d(0, 0, 0)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(99, 102, 241, 0.6)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
