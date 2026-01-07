"use client";

import { useEffect } from "react";

import { Button } from "@/shared/ui/Button";
import { colors } from "@/styles/colors";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Логирование ошибки в сервис мониторинга (например, Sentry)
    console.error("App Router Error:", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: colors.background.primary }}>
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="text-6xl mb-6">🚨</div>
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: colors.text.primary }}>
          Произошла ошибка
        </h2>
        <p className="mb-6" style={{ color: colors.text.secondary }}>
          Что-то пошло не так при загрузке страницы. Попробуйте еще раз.
        </p>
        <div className="space-y-4">
          <Button onClick={reset} variant="primary">
            Попробовать снова
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="secondary">
            На главную
          </Button>
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4">
              <summary
                className="text-sm cursor-pointer hover:opacity-80"
                style={{ color: colors.text.muted }}>
                Подробности ошибки (dev)
              </summary>
              <pre
                className="mt-2 p-4 rounded-none text-xs overflow-auto text-left"
                style={{
                  backgroundColor: colors.background.secondary,
                  color: colors.text.tertiary,
                }}>
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
