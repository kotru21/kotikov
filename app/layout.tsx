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
    default: "Kotikov - Frontend Developer",
    template: "%s | Kotikov",
  },
  description:
    "Frontend разработчик, специализирующийся на создании красивых и отзывчивых пользовательских интерфейсов. React, Next.js, TypeScript, современные веб-технологии.",
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
    "kotikov",
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
    url: "https://kotikov.is-a.dev",
    siteName: "Kotikov Portfolio",
    title: "Kotikov - Frontend Developer",
    description:
      "Frontend разработчик, специализирующийся на создании красивых и отзывчивых пользовательских интерфейсов",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kotikov - Frontend Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kotikov - Frontend Developer",
    description:
      "Frontend разработчик, специализирующийся на создании красивых и отзывчивых пользовательских интерфейсов",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://kotikov.is-a.dev",
  },
  category: "portfolio",
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
