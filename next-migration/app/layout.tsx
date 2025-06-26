import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";
import IEWarning from "./components/IEWarning";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Арсений Котиков | Web Developer",
  description: "Описание? Ну и что мне сюда написать?...",
  keywords: ["web developer", "frontend", "react", "next.js", "typescript"],
  authors: [{ name: "Arsenij Kotikov", url: "https://kotikov.pages.dev" }],
  creator: "Arsenij Kotikov",
  publisher: "Arsenij Kotikov",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://kotikov.pages.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://kotikov.pages.dev",
    siteName: "Арсений Котиков",
    title: "Арсений Котиков | Web Developer",
    description: "Описание? Ну и что мне сюда написать?...",
    images: [
      {
        url: "/images/web_preview.png",
        width: 1200,
        height: 630,
        alt: "Арсений Котиков - Web Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Арсений Котиков | Web Developer",
    description: "Описание? Ну и что мне сюда написать?...",
    creator: "@arsenij_kotikov",
    images: ["/images/web_preview.png"],
  },
  other: {
    "vk:description": "Описание? Ну и что мне сюда написать?...",
    "vk:image": "/images/web_preview_VK.png",
  },
  verification: {
    google: "7r85BpekX-CWJLJtao5ZqBQC18tXGM58WXHCHPT-Qrg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="image_src" href="/images/web_preview.png" />
        <script async src="https://www.tiktok.com/embed.js" />
        <script
          async
          src="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/prism.min.js"
          integrity="sha512-UOoJElONeUNzQbbKQbjldDf9MwOHqxNz49NNJJ1d90yp+X9edsHyJoAs6O4K19CZGaIdjI5ohK+O2y5lBTW6uQ=="
          crossOrigin="anonymous"
        />
        <script
          async
          src="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/plugins/line-numbers/prism-line-numbers.min.js"
          integrity="sha512-QTYXYEniHb1m0ZKtSyfpmw40uH9vPfV07vxsv/plIRMEiON4yOp2qoZiv/FTqFIOym4bdQ4+p9RtHaCMC0ApRw=="
          crossOrigin="anonymous"
        />
        <script
          async
          src="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-python.min.js"
          integrity="sha512-3qtI9+9JXi658yli19POddU1RouYtkTEhTHo6X5ilOvMiDfNvo6GIS6k2Ukrsx8MyaKSXeVrnIWeyH8G5EOyIQ=="
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <IEWarning />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
