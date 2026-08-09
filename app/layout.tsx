import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";

import { ScrollRestoration } from "@/features/scrolling";
import { THEME_CRITICAL_CSS, THEME_INIT_SCRIPT, THEME_SURFACE } from "@/features/theme";
import { ThemeColorMeta, ThemeProvider } from "@/features/theme/client";
import { personData } from "@/shared/config/content";

import { GoogleAnalytics } from "./components/GoogleAnalytics";
import { SkipLinks } from "./components/SkipLinks";
import { resolveGaMeasurementId } from "./gaMeasurementId";

/** Manrope covers Latin + Cyrillic for `lang="ru"` body copy. */
const manrope = Manrope({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gaId = resolveGaMeasurementId(process.env.NEXT_PUBLIC_GA_ID);

const siteTitle = `${personData.nameRu} (${personData.nickname}) — SOC / AppSec | Портфолио`;
const siteDescription = `${personData.description}. БГУИР, hoster.by, SAST и безопасная разработка.`;

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_SURFACE.light.background },
    { media: "(prefers-color-scheme: dark)", color: THEME_SURFACE.dark.background },
  ],
};

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | ${personData.nickname}`,
  },
  description: siteDescription,
  keywords: [
    "SOC",
    "AppSec",
    "information security",
    "информационная безопасность",
    "DFIR",
    "SAST",
    "OWASP",
    "Python",
    "TypeScript",
    "portfolio",
    "котиков",
    "kotikov",
    "Arsenij Kotikov",
    "Арсений Котиков",
    "hoster.by",
    "БГУИР",
  ],
  authors: [{ name: personData.name }],
  creator: personData.name,
  publisher: personData.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://ktkv.me",
    siteName: `${personData.nickname} Portfolio`,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og_image.png",
        width: 1200,
        height: 630,
        alt: `${personData.nameRu} — SOC / AppSec`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og_image.png"],
    creator: "@kotikov_dev",
    site: "@kotikov_dev",
  },
  alternates: {
    canonical: "https://ktkv.me",
  },
  category: "portfolio",
  metadataBase: new URL("https://ktkv.me"),
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo_mobile.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.JSX.Element> {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line react/no-danger -- trusted static theme CSS for FOUC prevention */}
        <style nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_CRITICAL_CSS }} />
        {/* eslint-disable-next-line react/no-danger -- trusted blocking theme init before hydration */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${manrope.variable} ${geistMono.variable} antialiased`}>
        {/*
          Theme init runs via blocking inline script in <head>.
          Scroll reset must stay in sync with shouldResetScrollOnLoad() in scrollUtils.ts.
        */}
        <Script id="scroll-init" strategy="beforeInteractive" nonce={nonce}>
          {`(function(){try{if('scrollRestoration' in history)history.scrollRestoration='manual';var h=location.hash;if(h.length<=1)window.scrollTo(0,0);}catch(e){}})();`}
        </Script>
        <ThemeProvider>
          <ThemeColorMeta />
          <ScrollRestoration />
          <SkipLinks />
          {children}
        </ThemeProvider>
        {gaId !== null ? <GoogleAnalytics measurementId={gaId} nonce={nonce} /> : null}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
