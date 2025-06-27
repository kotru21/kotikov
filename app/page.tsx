import { Metadata } from "next";
import Header from "./components/Header";
import SkillsCards from "./components/SkillsCards";
import Timeline from "./components/Timeline";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";
import StructuredData from "./components/StructuredData";

export const metadata: Metadata = {
  title: "Главная страница",
  description:
    "Портфолио frontend разработчика Kotikov. Современные веб-приложения с использованием React, Next.js, TypeScript. Опыт работы, навыки и контакты.",
  openGraph: {
    title: "Kotikov - Frontend Developer | Портфолио",
    description:
      "Портфолио frontend разработчика Kotikov. Современные веб-приложения с использованием React, Next.js, TypeScript.",
    url: "https://ktkv.me",
    type: "website",
  },
  twitter: {
    title: "Kotikov - Frontend Developer | Портфолио",
    description:
      "Портфолио frontend разработчика Kotikov. Современные веб-приложения с использованием React, Next.js, TypeScript.",
  },
};

export default function Home() {
  return (
    <div>
      <StructuredData />
      <Header />

      <SkillsCards />

      <Timeline />

      <Contacts />

      <Footer />
    </div>
  );
}
