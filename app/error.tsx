"use client";

import { useEffect } from "react";

import { Button, Card } from "@/shared/ui";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps): React.JSX.Element {
  useEffect(() => {
    console.error("App Router Error:", error);
  }, [error]);

  return (
    <div className="bg-background-primary flex min-h-screen items-center justify-center">
      <Card variant="bgNone" padding="lg" className="mx-auto max-w-md text-center">
        <div className="mb-6 text-6xl">🚨</div>
        <h2 className="text-text-primary mb-4 text-2xl font-bold">Произошла ошибка</h2>
        <p className="text-text-secondary mb-6">
          Что-то пошло не так при загрузке страницы. Попробуйте еще раз.
        </p>
        <div className="space-y-4">
          <Button onClick={reset} variant="primary">
            Попробовать снова
          </Button>
          <Button
            onClick={() => {
              window.location.href = "/";
            }}
            variant="secondary"
          >
            На главную
          </Button>
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4">
              <summary className="text-text-muted cursor-pointer text-sm hover:opacity-80">
                Подробности ошибки (dev)
              </summary>
              <pre className="bg-background-secondary text-text-tertiary mt-2 overflow-auto rounded-none border-2 border-black p-4 text-left text-xs dark:border-white">
                {error.message}
                {"\n"}
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </Card>
    </div>
  );
}
