"use client";

import { useEffect } from "react";

import { GridErrorMark } from "@/app/components/GridErrorMark";

// Inline colors only — global-error replaces the root layout, so chrome
// cannot depend on theme tokens. Values mirror src/shared/styles/colors.ts:
// background.dark = #0a0a0a, text.onDark = #ededed,
// primary.500 = #00ffb9, primary.600 = #00d99d, neutral.900 = #111111
const criticalColors = {
  background: "#0a0a0a",
  text: {
    primary: "#ededed",
    secondary: "#ededed",
  },
  button: {
    bg: "#00ffb9",
    hover: "#00d99d",
    text: "#111111",
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
    <html lang="ru" style={{ colorScheme: "dark" }}>
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
          .global-error-btn:hover {
            background-color: ${criticalColors.button.hover};
          }
          .global-error-btn:focus-visible {
            background-color: ${criticalColors.button.hover};
            outline: 2px solid ${criticalColors.text.primary};
            outline-offset: 2px;
          }
          .global-error-actions {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
          }
          .global-error-link {
            display: inline-block;
            color: ${criticalColors.text.secondary};
            text-decoration: underline;
            text-underline-offset: 4px;
          }
          .global-error-link:hover {
            color: ${criticalColors.text.primary};
          }
          .global-error-link:focus-visible {
            color: ${criticalColors.text.primary};
            outline: 2px solid ${criticalColors.text.primary};
            outline-offset: 2px;
          }
        `}</style>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: criticalColors.background,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "28rem",
              padding: "2rem",
              textAlign: "center",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <GridErrorMark code="error" />
            <h1
              style={{
                marginBottom: "1rem",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: criticalColors.text.primary,
              }}
            >
              Критическая ошибка
            </h1>
            <p style={{ marginBottom: "1.5rem", color: criticalColors.text.secondary }}>
              Произошла серьезная ошибка в приложении. Пожалуйста, перезагрузите страницу.
            </p>
            <div className="global-error-actions">
              <button type="button" onClick={reset} className="global-error-btn">
                Перезагрузить
              </button>
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
