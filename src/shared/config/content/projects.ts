import type { IconType } from "react-icons";
import { FaReact } from "react-icons/fa";
import { SiTauri, SiTypescript } from "react-icons/si";

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
  imageSrc?: string; // slot for a future screenshot
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
    slug: "file-manager-tauri",
    title: "File Manager",
    eyebrow: "Desktop-приложение",
    summary:
      "Файловый менеджер на Tauri: виртуализированные списки, глубокая кастомизация UI и покрытие тестами (Unit / Integration / E2E).",
    stack: ["TypeScript", "Tauri", "Tailwind CSS", "Vitest"],
    role: "Frontend Engineer",
    imageSrc: "/projects/file-manager-tauri.png",
    imageAlt: "Превью интерфейса File Manager",
    repoUrl: "https://github.com/kotru21/FileManagerTauri",
    cardPeriod: "2025–26",
    cardMeta: "Desktop · Open Source",
    cardPattern: "waves",
    accentColor: "#2cffc7",
    cardIcon: SiTauri,
    details: {
      challenge: "Навигация по тысячам файлов без лагов UI",
      solution: "Виртуализированные списки и кастомные контролы",
      outcome: "Unit + Integration + E2E покрытие, open source",
    },
  },
  {
    slug: "web-messenger",
    title: "Web Messenger",
    eyebrow: "Реалтайм-продукт",
    summary:
      "Веб-мессенджер с чатами, авторизацией и реал-тайм состоянием на JavaScript full-stack.",
    stack: ["React", "Node.js", "Socket.IO", "MongoDB", "JWT"],
    role: "Full-Stack Developer",
    imageSrc: "/projects/web-messenger.png",
    imageAlt: "Превью приложения Web Messenger",
    repoUrl: "https://github.com/kotru21/webchat",
    cardPeriod: "2025",
    cardMeta: "Full-Stack · Realtime",
    cardPattern: "dots",
    accentColor: "#63ffd5",
    cardIcon: FaReact,
    details: {
      challenge: "Мгновенный обмен сообщениями между пользователями",
      solution: "Socket.IO для realtime, JWT auth, MongoDB для истории",
      outcome: "Full-stack продукт с авторизацией и историей чатов",
    },
  },
  {
    slug: "tiktok-analyzer",
    title: "TikTok Analyzer",
    eyebrow: "Интерфейс для данных",
    summary:
      "Анализ чатов и активности TikTok-аккаунтов: структурированные представления для быстрой интерпретации.",
    stack: ["TypeScript", "React", "Node.js", "Git"],
    role: "Frontend Engineer",
    imageSrc: "/projects/tiktok-analyzer.png",
    imageAlt: "Превью интерфейса TikTok Analyzer",
    repoUrl: "https://github.com/kotru21/tiktok-chats-visualizer",
    cardPeriod: "2025",
    cardMeta: "Data UI · Analytics",
    cardPattern: "chevrons",
    accentColor: "#00ffb9",
    cardIcon: SiTypescript,
    details: {
      challenge: "Быстрая интерпретация активности TikTok-аккаунтов",
      solution: "Структурированные data views для чатов",
      outcome: "Инструмент для анализа и визуализации чат-активности",
    },
  },
];
