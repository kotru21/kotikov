/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        text: "var(--color-text)",
        accent: "var(--color-accent)",
      },
      fontFamily: {
        sans: "var(--font-family-sans)",
      },
      borderRadius: {
        DEFAULT: "var(--border-radius)",
      },
      boxShadow: {
        DEFAULT: "var(--box-shadow)",
      },
      transitionProperty: {
        DEFAULT: "var(--transition)",
      },
    },
  },
};
