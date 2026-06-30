"use client";

import { useEffect } from "react";

// Inline colors only — Next.js global-error cannot import app modules.
// Values mirror src/shared/styles/colors.ts:
// primary.500 = #00ffb9, primary.600 = #00d99d, neutral.900 = #111111
const criticalColors = {
  background: "#000000",
  text: {
    primary: "#ffffff",
    secondary: "#e5e5e5",
    muted: "#737373",
  },
  error: "#dc2626",
  errorLight: "#fee2e2",
  button: {
    bg: "#00ffb9", // colors.primary[500]
    hover: "#00d99d", // colors.primary[600]
    text: "#111111", // colors.neutral[900]
  },
};

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps): React.JSX.Element {
  useEffect(() => {
    // Критическая ошибка - лог с высоким приоритетом
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html lang="ru">
      <body style={{ margin: 0, padding: 0 }}>
        <div
          className="flex min-h-screen items-center justify-center"
          style={{ backgroundColor: criticalColors.background }}
        >
          <div className="mx-auto max-w-md p-8 text-center">
            <div className="mb-6 text-6xl">💥</div>
            <h2 className="mb-4 text-2xl font-bold" style={{ color: criticalColors.text.primary }}>
              Критическая ошибка
            </h2>
            <p className="mb-6" style={{ color: criticalColors.text.secondary }}>
              Произошла серьезная ошибка в приложении. Пожалуйста, перезагрузите страницу.
            </p>
            <button
              onClick={reset}
              className="rounded-none border-2 border-black px-4 py-2 transition-colors"
              style={{
                backgroundColor: criticalColors.button.bg,
                color: criticalColors.button.text,
                border: `2px solid ${criticalColors.button.bg}`,
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = criticalColors.button.hover;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = criticalColors.button.bg;
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = criticalColors.button.hover;
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = criticalColors.button.bg;
              }}
            >
              Перезагрузить
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
