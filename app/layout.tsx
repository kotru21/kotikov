import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { ScrollRestoration } from "@/features/scrolling";
import { THEME_CRITICAL_CSS, THEME_INIT_SCRIPT, THEME_SURFACE, ThemeProvider } from "@/features/theme";
import { personData } from "@/shared/config/content";

import { SkipLinks } from "./components/SkipLinks";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gaId = process.env.NEXT_PUBLIC_GA_ID;

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: THEME_CRITICAL_CSS }} />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/*
          Theme init runs via blocking inline script in <head>.
          Scroll reset must stay in sync with shouldResetScrollOnLoad() in scrollUtils.ts.
        */}
        <Script id="scroll-init" strategy="beforeInteractive">
          {`(function(){try{if('scrollRestoration' in history)history.scrollRestoration='manual';var h=location.hash;if(h.length<=1)window.scrollTo(0,0);}catch(e){}})();`}
        </Script>
        <ThemeProvider>
          <ScrollRestoration />
          <SkipLinks />
          {children}
        </ThemeProvider>
        {gaId !== undefined && gaId !== "" ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="lazyOnload"
            />
            <Script id="ga-init" strategy="lazyOnload">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
            </Script>
          </>
        ) : null}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
