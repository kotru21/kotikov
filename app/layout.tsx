import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: {
    default: "Kotikov — Frontend разработка на React/Next.js | Портфолио",
    template: "%s | Kotikov",
  },
  description:
    "Frontend разработчик Kotikov. Frontend разработка на React, JavaScript, Node.js и фреймворк Next.js: создаю быстрые веб-приложения, интерфейсы и пользовательский опыт.",
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
    "фронтенд разработчик",
    "портфолио разработчика",
  ],
  authors: [{ name: "Kotikov" }],
  creator: "Kotikov",
  publisher: "Kotikov",
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
    siteName: "Kotikov Portfolio",
    title: "Kotikov — Frontend разработка на React/Next.js | Портфолио",
    description:
      "Frontend разработчик Kotikov. Frontend разработка на React, JavaScript, Node.js и фреймворк Next.js: создаю быстрые веб-приложения, интерфейсы и пользовательский опыт.",
    images: [
      {
        url: "/og_image.png",
        width: 1200,
        height: 630,
        alt: "Kotikov — Frontend разработка на React/Next.js",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kotikov — Frontend разработка на React/Next.js | Портфолио",
    description:
      "Frontend разработчик Kotikov. Frontend разработка на React, JavaScript, Node.js и фреймворк Next.js: создаю быстрые веб-приложения, интерфейсы и пользовательский опыт.",
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
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        {gaId ? (
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
