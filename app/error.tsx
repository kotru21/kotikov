"use client";

import { useEffect } from "react";

import { GridErrorMark } from "@/app/components/GridErrorMark";
import { Button } from "@/shared/ui/Button";
import { GRID_STROKE, GRID_TYPE } from "@/shared/ui/gridChrome";

const ERROR_CANVAS = "bg-[#f5f5f3] dark:bg-[#0a0a0a]";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

interface ErrorDevDetailsProps {
  message: string;
  stack?: string;
}

interface ErrorRecoveryActionsProps {
  reset: () => void;
}

function ErrorDevDetails({ message, stack }: ErrorDevDetailsProps): React.JSX.Element {
  return (
    <details className="mt-4 w-full">
      <summary className={`${GRID_TYPE} cursor-pointer text-sm hover:opacity-80`}>
        Подробности ошибки (dev)
      </summary>
      <pre
        className={`${ERROR_CANVAS} ${GRID_TYPE} mt-2 overflow-auto border-2 border-[#111] p-4 text-left text-xs dark:border-[#ededed]`}
      >
        {message}
        {"\n"}
        {stack}
      </pre>
    </details>
  );
}

function ErrorRecoveryActions({ reset }: ErrorRecoveryActionsProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button onClick={reset} variant="primary" className="text-[#111]">
        Попробовать снова
      </Button>
      <Button href="/" variant="secondary">
        На главную
      </Button>
    </div>
  );
}

export default function Error({ error, reset }: ErrorPageProps): React.JSX.Element {
  useEffect(() => {
    console.error("App Router error", { digest: error.digest ?? "unknown" });
  }, [error.digest]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`${ERROR_CANVAS} ${GRID_TYPE} flex min-h-screen items-center justify-center ${GRID_STROKE}`}
    >
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center p-8 text-center">
        <GridErrorMark code="error" />
        <h1 className={`${GRID_TYPE} mb-4 text-2xl font-bold`}>Произошла ошибка</h1>
        <p className={`${GRID_TYPE} mb-6`}>
          Что-то пошло не так при загрузке страницы. Попробуйте еще раз.
        </p>
        <ErrorRecoveryActions reset={reset} />
        {process.env.NODE_ENV === "development" && (
          <ErrorDevDetails message={error.message} stack={error.stack} />
        )}
      </div>
    </main>
  );
}
