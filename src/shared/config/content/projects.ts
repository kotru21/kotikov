import type { IconType } from "react-icons";
import { FaPython, FaReact } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";

/**
 * Featured projects content. Canonical in `@/shared/config/content`; entity
 * `ProjectCard` renders it. Domain copy stays shared — entities are type/UI facades.
 */
export type ProjectCardPattern = "dots" | "chevrons" | "stripes";

export interface ProjectContent {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  role: string;
  repoUrl: string;
  liveUrl?: string;
  cardPeriod: string;
  cardMeta: string;
  cardPattern: ProjectCardPattern;
  accentColor: string;
  cardIcon: IconType;
}

export interface ProjectsSectionContent {
  eyebrow: string;
  title: string;
  description: string;
}

export const projectsSection = {
  eyebrow: "Проекты",
  title: "Избранные работы",
  description:
    "Несколько проектов, которые показывают, как я думаю о продукте, интерфейсе и реализации.",
} as const satisfies ProjectsSectionContent;

export const projectsData: ProjectContent[] = [
  {
    slug: "code-analyzer",
    title: "CodeAnalyzer",
    eyebrow: "AppSec · SAST",
    summary:
      "Статический анализатор для JS/TS: 13 правил по классам OWASP Top 10, taint analysis, вывод SARIF 2.1.0, сравнение с Semgrep на реальных корпусах. Полностью в Docker.",
    role: "AppSec Tooling",
    repoUrl: "https://github.com/kotru21/CodeAnalyzerPython",
    cardPeriod: "2025–26",
    cardMeta: "SAST · Open Source",
    cardPattern: "chevrons",
    accentColor: "#2cffc7",
    cardIcon: FaPython,
  },
  {
    slug: "bsuir-iis-api",
    title: "BSUIR IIS API",
    eyebrow: "Typed public API client",
    summary:
      "Опубликованный TypeScript ESM SDK для IIS API БГУИР и небольшой Next.js-клиент: расписание, экзамены, справочники. Акцент на контрактах и сопровождении пакета.",
    role: "Library Author",
    repoUrl: "https://github.com/kotru21/bsuir-iis-api",
    cardPeriod: "2025–26",
    cardMeta: "SDK · Maintained",
    cardPattern: "stripes",
    accentColor: "#63ffd5",
    cardIcon: SiTypescript,
  },
  {
    slug: "web-messenger",
    title: "Web Messenger",
    eyebrow: "Auth · trust boundaries",
    summary:
      "Full-stack чат с JWT, публичными и приватными диалогами, медиа и realtime. В витрине — про authn/authz и границы доверия, а не про «приятный UX».",
    role: "Full-Stack Developer",
    repoUrl: "https://github.com/kotru21/webchat",
    cardPeriod: "2025",
    cardMeta: "Auth · Realtime",
    cardPattern: "dots",
    accentColor: "#00ffb9",
    cardIcon: FaReact,
  },
];
