import { FaCss3Alt, FaGitAlt, FaNodeJs, FaReact } from "react-icons/fa";
import { SiExpress, SiMongodb, SiNextdotjs, SiTypescript } from "react-icons/si";

import { colors } from "@/styles/colors";

export const skillsData = [
  {
    id: 1,
    name: "React",
    description: "Современные интерактивные интерфейсы",
    icon: FaReact,
    color: colors.accent[600],
    category: "frontend" as const,
  },
  {
    id: 2,
    name: "TypeScript",
    description: "Типобезопасный код больших приложений",
    icon: SiTypescript,
    color: colors.accent[700],
    category: "frontend" as const,
  },
  {
    id: 3,
    name: "Next.js",
    description: "React-фреймворк с SSR/SSG",
    icon: SiNextdotjs,
    color: colors.accent[800],
    category: "frontend" as const,
  },
  {
    id: 4,
    name: "CSS / Tailwind",
    description: "Адаптивная вёрстка и стилизация",
    icon: FaCss3Alt,
    color: colors.accent[500],
    category: "frontend" as const,
  },
  {
    id: 5,
    name: "Node.js",
    description: "Серверная разработка на JavaScript",
    icon: FaNodeJs,
    color: colors.semantic.success.DEFAULT,
    category: "backend" as const,
  },
  {
    id: 6,
    name: "Express.js",
    description: "HTTP-API на Node.js",
    icon: SiExpress,
    color: colors.accent[700],
    category: "backend" as const,
  },
  {
    id: 7,
    name: "MongoDB",
    description: "Документная NoSQL база данных",
    icon: SiMongodb,
    color: colors.semantic.success.DEFAULT,
    category: "backend" as const,
  },
  {
    id: 8,
    name: "Git",
    description: "Контроль версий и командная работа",
    icon: FaGitAlt,
    color: colors.accent[600],
    category: "tools" as const,
  },
];

export const skillGroups = [
  { title: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML", "CSS"] },
  { title: "Backend", items: ["Node.js", "Express", "MongoDB", "REST API"] },
  { title: "Инструменты", items: ["Git", "Vitest", "Tauri", "Socket.IO"] },
] as const;
