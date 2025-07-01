"use client";

import { useEffect } from "react";

// Инлайн цвета для global-error (не можем импортировать из-за критичности)
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
    bg: "#6366f1",
    hover: "#4f46e5",
  },
};

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Критическая ошибка - логируем с высоким приоритетом
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html lang="ru">
      <body style={{ margin: 0, padding: 0 }}>
        <div
          className="min-h-screen flex items-center justify-center "
          style={{ backgroundColor: criticalColors.background }}>
          <div className="text-center p-8 max-w-md mx-auto">
            <div className="text-6xl mb-6">💥</div>
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: criticalColors.text.primary }}>
              Критическая ошибка
            </h2>
            <p
              className="mb-6"
              style={{ color: criticalColors.text.secondary }}>
              Произошла серьезная ошибка в приложении. Пожалуйста, перезагрузите
              страницу.
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: criticalColors.button.bg,
                color: criticalColors.text.primary,
                border: "none",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor =
                  criticalColors.button.hover;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor =
                  criticalColors.button.bg;
              }}>
              Перезагрузить
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
