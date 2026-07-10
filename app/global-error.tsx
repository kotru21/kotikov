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
  button: {
    bg: "#00ffb9",
    hover: "#00d99d",
    text: "#111111",
  },
  mark: {
    primary: "#00ffb9",
    square: "#ffffff",
    badge: "#111111",
    badgeText: "#ffffff",
  },
};

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps): React.JSX.Element {
  useEffect(() => {
    console.error("Global Error", { digest: error.digest ?? "unknown" });
  }, [error.digest]);

  return (
    <html lang="ru">
      <body style={{ margin: 0, padding: 0 }}>
        <style>{`
          .global-error-btn {
            background-color: ${criticalColors.button.bg};
            color: ${criticalColors.button.text};
            border: 2px solid ${criticalColors.button.bg};
            cursor: pointer;
            border-radius: 0;
            padding: 0.5rem 1rem;
            font-weight: 700;
            transition: background-color 150ms ease;
          }
          .global-error-btn:hover,
          .global-error-btn:focus-visible {
            background-color: ${criticalColors.button.hover};
            outline: none;
          }
          .global-error-link {
            display: inline-block;
            margin-top: 1rem;
            color: ${criticalColors.text.secondary};
            text-decoration: underline;
            text-underline-offset: 4px;
          }
          .global-error-link:hover,
          .global-error-link:focus-visible {
            color: ${criticalColors.text.primary};
            outline: none;
          }
        `}</style>
        <div
          className="flex min-h-screen items-center justify-center"
          style={{ backgroundColor: criticalColors.background }}
        >
          <div className="mx-auto max-w-md p-8 text-center">
            <div
              aria-hidden="true"
              style={{
                position: "relative",
                width: "7rem",
                height: "7rem",
                margin: "0 auto 2rem",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: criticalColors.mark.primary,
                  border: "2px solid #ffffff",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "1rem",
                  left: "1rem",
                  width: "5rem",
                  height: "5rem",
                  backgroundColor: criticalColors.mark.square,
                  border: "2px solid #ffffff",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  right: "0.5rem",
                  bottom: "0.5rem",
                  backgroundColor: criticalColors.mark.badge,
                  color: criticalColors.mark.badgeText,
                  padding: "0.25rem 0.5rem",
                  fontFamily: "ui-monospace, monospace",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                error
              </span>
            </div>
            <h2 className="mb-4 text-2xl font-bold" style={{ color: criticalColors.text.primary }}>
              Критическая ошибка
            </h2>
            <p className="mb-6" style={{ color: criticalColors.text.secondary }}>
              Произошла серьезная ошибка в приложении. Пожалуйста, перезагрузите страницу.
            </p>
            <button type="button" onClick={reset} className="global-error-btn">
              Перезагрузить
            </button>
            <div>
              {/* global-error cannot rely on app Link; plain anchor is intentional */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- isolated critical shell */}
              <a href="/" className="global-error-link">
                На главную
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
