"use client";

import React from "react";
import { Button } from "./ui";
import { colors } from "../styles/colors";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  level?: "component" | "section" | "page";
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `Error Boundary (${this.props.level || "component"}):`,
      error,
      errorInfo
    );

    // Вызываем пользовательский обработчик если есть
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Используем кастомный fallback если передан
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            retry={this.handleRetry}
          />
        );
      }

      // Разные UI в зависимости от уровня
      const isComponentLevel = this.props.level === "component";

      return (
        <div
          className={
            isComponentLevel
              ? "p-4 border rounded-lg"
              : "min-h-screen flex items-center justify-center"
          }
          style={{
            backgroundColor: isComponentLevel
              ? colors.semantic.error.light
              : colors.background.primary,
            borderColor: isComponentLevel
              ? colors.semantic.error.DEFAULT
              : "transparent",
          }}>
          <div
            className={`text-center ${
              isComponentLevel ? "max-w-sm" : "p-8 max-w-md mx-auto"
            }`}>
            <div
              className={isComponentLevel ? "text-2xl mb-2" : "text-6xl mb-6"}>
              {isComponentLevel ? "⚠️" : "😵"}
            </div>
            <h2
              className={`font-bold mb-2 ${
                isComponentLevel ? "text-lg" : "text-2xl mb-4"
              }`}
              style={{
                color: isComponentLevel
                  ? colors.semantic.error.dark
                  : colors.text.primary,
              }}>
              {isComponentLevel ? "Ошибка компонента" : "Что-то пошло не так"}
            </h2>
            <p
              className={isComponentLevel ? "text-sm mb-3" : "mb-6"}
              style={{
                color: isComponentLevel
                  ? colors.semantic.error.DEFAULT
                  : colors.text.secondary,
              }}>
              {isComponentLevel
                ? "Этот компонент не смог загрузиться корректно."
                : "Произошла неожиданная ошибка. Мы уже работаем над её исправлением."}
            </p>
            <div className="space-y-2">
              <Button
                onClick={this.handleRetry}
                variant="primary"
                size={isComponentLevel ? "sm" : "md"}>
                Попробовать снова
              </Button>
              {!isComponentLevel && (
                <Button
                  onClick={() => window.location.reload()}
                  variant="secondary">
                  Обновить страницу
                </Button>
              )}
              {process.env.NODE_ENV === "development" && (
                <details className="mt-4">
                  <summary
                    className="text-sm cursor-pointer hover:opacity-80"
                    style={{ color: colors.text.muted }}>
                    Подробности ошибки (dev)
                  </summary>
                  <pre
                    className={`mt-2 p-2 rounded-lg overflow-auto ${
                      isComponentLevel ? "text-xs" : "text-xs"
                    }`}
                    style={{
                      backgroundColor: colors.background.secondary,
                      color: colors.text.tertiary,
                    }}>
                    {this.state.error?.message}
                    {"\n"}
                    {this.state.error?.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
