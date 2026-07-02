import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { ScrollRestoration } from "@/features/scrolling";
import { THEME_CRITICAL_CSS, THEME_INIT_SCRIPT, ThemeProvider } from "@/features/theme";
import { personData } from "@/shared/config/content";

import { getServerThemeHtmlClass } from "./_lib/get-server-theme-class";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gaId = process.env.NEXT_PUBLIC_GA_ID;

const siteTitle = `${personData.nameRu} (${personData.nickname}) — Frontend разработка на React/Next.js | Портфолио`;
const siteDescription = `Frontend разработчик ${personData.nameRu} (${personData.nickname}). Frontend разработка на React, JavaScript, Node.js и фреймворк Next.js: создаю быстрые веб-приложения, интерфейсы и пользовательский опыт.`;

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | ${personData.nickname}`,
  },
  description: siteDescription,
  keywords: [
    "frontend developer",
    "frontend разработка",
    "веб-разработчик",
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "HTML",
    "CSS",
    "фреймворк Next.js",
    "Tailwind CSS",
    "UI/UX",
    "responsive design",
    "portfolio",
    "котиков",
    "kotikov",
    "Arsenij Kotikov",
    "Арсений Котиков",
    "arsenij kotikov",
    "фронтенд разработчик",
    "портфолио разработчика",
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
        alt: `${personData.nameRu} — Frontend разработка на React/Next.js`,
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
  const serverThemeClass = await getServerThemeHtmlClass();

  return (
    <html lang="ru" className={serverThemeClass} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
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
          <a
            href="#projects"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:border-2 focus:border-black focus:bg-white focus:px-4 focus:py-2 focus:font-bold dark:focus:border-white dark:focus:bg-black dark:focus:text-white"
          >
            К проектам
          </a>
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
