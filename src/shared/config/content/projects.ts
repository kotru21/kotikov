import type { IconType } from "react-icons";
import { FaPython, FaReact } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";

export type ProjectCardPattern = "waves" | "dots" | "chevrons" | "stripes" | "scatter";

export interface ProjectDetail {
  challenge: string;
  solution: string;
  outcome: string;
}

export interface ProjectContent {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  stack: string[];
  role: string;
  imageSrc?: string;
  imageAlt: string;
  repoUrl: string;
  liveUrl?: string;
  cardPeriod: string;
  cardMeta: string;
  cardPattern: ProjectCardPattern;
  accentColor: string;
  cardIcon: IconType;
  details: ProjectDetail;
}

export const projectsData: ProjectContent[] = [
  {
    slug: "code-analyzer",
    title: "CodeAnalyzer",
    eyebrow: "AppSec · SAST",
    summary:
      "Статический анализатор для JS/TS: 13 правил по классам OWASP Top 10, taint analysis, вывод SARIF 2.1.0, сравнение с Semgrep на реальных корпусах. Полностью в Docker.",
    stack: ["Python", "FastAPI", "tree-sitter", "Celery", "Redis", "PostgreSQL", "Docker"],
    role: "AppSec Tooling",
    imageAlt: "CodeAnalyzer — SAST для JS/TS",
    repoUrl: "https://github.com/kotru21/CodeAnalyzerPython",
    cardPeriod: "2025–26",
    cardMeta: "SAST · Open Source",
    cardPattern: "chevrons",
    accentColor: "#2cffc7",
    cardIcon: FaPython,
    details: {
      challenge: "Находить injection-классы в JS/TS без ручного просмотра всего репозитория",
      solution: "Taint analysis на tree-sitter, правила под OWASP/CWE, SARIF для CI",
      outcome: "13 классов уязвимостей, бенчмарк против Semgrep, Docker-поставка",
    },
  },
  {
    slug: "bsuir-iis-api",
    title: "BSUIR IIS API",
    eyebrow: "Typed public API client",
    summary:
      "Опубликованный TypeScript ESM SDK для IIS API БГУИР и небольшой Next.js-клиент: расписание, экзамены, справочники. Акцент на контрактах и сопровождении пакета, не на «красивом UI».",
    stack: ["TypeScript", "ESM", "npm", "Next.js"],
    role: "Library Author",
    imageAlt: "BSUIR IIS API — TypeScript SDK",
    repoUrl: "https://github.com/kotru21/bsuir-iis-api",
    cardPeriod: "2025–26",
    cardMeta: "SDK · Maintained",
    cardPattern: "stripes",
    accentColor: "#63ffd5",
    cardIcon: SiTypescript,
    details: {
      challenge: "Стабильный типизированный доступ к университетскому API без ad-hoc fetch-обёрток",
      solution: "ESM-пакет с явными контрактами и showcase-приложение на App Router",
      outcome: "Публичный SDK и поддерживаемый consumer для расписаний и справочников",
    },
  },
  {
    slug: "web-messenger",
    title: "Web Messenger",
    eyebrow: "Auth · trust boundaries",
    summary:
      "Full-stack чат с JWT, публичными и приватными диалогами, медиа и realtime. В витрине — про authn/authz и границы доверия, а не про «приятный UX».",
    stack: ["React", "Node.js", "Express", "MongoDB", "Socket.IO", "JWT"],
    role: "Full-Stack Developer",
    imageSrc: "/projects/web-messenger.png",
    imageAlt: "Web Messenger — JWT и realtime",
    repoUrl: "https://github.com/kotru21/webchat",
    cardPeriod: "2025",
    cardMeta: "Auth · Realtime",
    cardPattern: "dots",
    accentColor: "#00ffb9",
    cardIcon: FaReact,
    details: {
      challenge: "Разделить публичные и приватные каналы и не протечь сессию через realtime-слой",
      solution: "JWT auth, явные границы для Socket.IO-событий, контроль доступа к диалогам",
      outcome: "Рабочий мессенджер с auth, историей и присутствием — полезный кейс для secure review",
    },
  },
];
