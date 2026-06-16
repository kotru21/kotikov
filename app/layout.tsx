import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { ThemeProvider } from "@/features/theme";
import { personData } from "@/shared/config/content";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=localStorage.getItem('theme');var d=c==='dark'||((c===null||c==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <a
            href="#projects"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:border-2 focus:border-black focus:bg-white focus:px-4 focus:py-2 focus:font-bold"
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
