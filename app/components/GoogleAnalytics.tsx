"use client";

import Script from "next/script";
import { useCallback, useSyncExternalStore } from "react";

const CONSENT_STORAGE_KEY = "ktkv-ga-consent";
const CONSENT_EVENT = "ktkv-ga-consent";

type ConsentState = "unknown" | "granted" | "denied";

function readConsent(): ConsentState {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (value === "granted" || value === "denied") return value;
  } catch {
    // private mode / blocked storage
  }
  return "unknown";
}

function subscribeConsent(onStoreChange: () => void): () => void {
  const onChange = (): void => {
    onStoreChange();
  };
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

interface GoogleAnalyticsProps {
  measurementId: string;
}

/**
 * Loads gtag only after explicit consent. Vercel Analytics stays separate (first-party).
 */
export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps): React.JSX.Element | null {
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => "unknown" as const);

  const persist = useCallback((next: Exclude<ConsentState, "unknown">) => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, next);
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }, []);

  if (consent === "granted") {
    return (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          strategy="lazyOnload"
        />
        <Script id="ga-init" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${measurementId}',{anonymize_ip:true});`}
        </Script>
      </>
    );
  }

  if (consent !== "unknown") return null;

  return (
    <div
      role="dialog"
      aria-label="Согласие на аналитику"
      className="border-primary-500 bg-background-primary text-text-primary fixed inset-x-0 bottom-0 z-[100] border-t-4 p-4 shadow-none md:inset-x-auto md:right-4 md:bottom-4 md:max-w-md md:border-2 md:border-black dark:border-white dark:bg-black dark:text-white"
    >
      <p className="text-sm leading-relaxed">
        Для статистики посещений можно включить Google Analytics (анонимизация IP). Отказ не влияет
        на работу сайта.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="bg-primary-500 focus-visible:ring-primary-500 min-h-11 px-4 text-sm font-bold text-black uppercase focus-visible:ring-2 focus-visible:outline-none"
          onClick={() => {
            persist("granted");
          }}
        >
          Принять
        </button>
        <button
          type="button"
          className="focus-visible:ring-primary-500 min-h-11 border-2 border-black px-4 text-sm font-bold uppercase dark:border-white focus-visible:ring-2 focus-visible:outline-none"
          onClick={() => {
            persist("denied");
          }}
        >
          Отклонить
        </button>
      </div>
    </div>
  );
}
