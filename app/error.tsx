"use client";

import { useEffect } from "react";

import { Button } from "@/shared/ui";
import { colors } from "@/styles/colors";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps): React.JSX.Element {
  useEffect(() => {
    // Логирование ошибки в сервис мониторинга (например, Sentry)
    console.error("App Router Error:", error);
  }, [error]);

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div className="mx-auto max-w-md p-8 text-center">
        <div className="mb-6 text-6xl">🚨</div>
        <h2 className="mb-4 text-2xl font-bold" style={{ color: colors.text.primary }}>
          Произошла ошибка
        </h2>
        <p className="mb-6" style={{ color: colors.text.secondary }}>
          Что-то пошло не так при загрузке страницы. Попробуйте еще раз.
        </p>
        <div className="space-y-4">
          <Button onClick={reset} variant="primary">
            Попробовать снова
          </Button>
          <Button onClick={() => (window.location.href = "/")} variant="secondary">
            На главную
          </Button>
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4">
              <summary
                className="cursor-pointer text-sm hover:opacity-80"
                style={{ color: colors.text.muted }}
              >
                Подробности ошибки (dev)
              </summary>
              <pre
                className="mt-2 overflow-auto rounded-none p-4 text-left text-xs"
                style={{
                  backgroundColor: colors.background.secondary,
                  color: colors.text.tertiary,
                }}
              >
                {error.message}
                {"\n"}
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
