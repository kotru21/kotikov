"use client";

import React from "react";
import { Button } from "./ui";

interface ErrorBoundaryProps {
  children: React.ReactNode;
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
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary">
          <div className="text-center p-8 max-w-md mx-auto">
            <div className="text-6xl mb-6">😵</div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Что-то пошло не так
            </h2>
            <p className="text-text-secondary mb-6">
              Произошла неожиданная ошибка. Мы уже работаем над её исправлением.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => window.location.reload()}
                variant="primary">
                Обновить страницу
              </Button>
              <details className="mt-4">
                <summary className="text-sm text-text-muted cursor-pointer hover:text-text-secondary">
                  Подробности ошибки
                </summary>
                <pre className="mt-2 p-4 bg-background-secondary rounded-lg text-xs text-text-tertiary overflow-auto">
                  {this.state.error?.message}
                  {"\n"}
                  {this.state.error?.stack}
                </pre>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
