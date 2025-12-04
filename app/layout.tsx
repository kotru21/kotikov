import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kotikov - Frontend Developer | Портфолио",
    template: "%s | Kotikov",
  },
  description:
    "Frontend разработчик Kotikov. Создаю современные веб-приложения на React, Next.js, TypeScript.",
  keywords: [
    "frontend developer",
    "веб-разработчик",
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "HTML",
    "CSS",
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
    title: "Kotikov - Frontend Developer | Портфолио",
    description:
      "Frontend разработчик Kotikov. Создаю современные веб-приложения на React, Next.js, TypeScript.",
    images: [
      {
        url: "/og_image.png",
        width: 1200,
        height: 630,
        alt: "Kotikov - Frontend Developer",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kotikov - Frontend Developer | Портфолио",
    description:
      "Frontend разработчик Kotikov. Создаю современные веб-приложения на React, Next.js, TypeScript.",
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
        url: "/logo_mobile.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/logo_mobile.svg",
    apple: "/logo_mobile.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
