import { FaBug, FaGitAlt, FaPython, FaReact, FaShieldAlt } from "react-icons/fa";
import { SiBurpsuite, SiFastapi, SiTypescript, SiWireshark } from "react-icons/si";

import { colors } from "@/styles/colors";

/** Subtitle under the Skills heading — InfoSec stack, not frontend marketing. */
export const skillsStackLine = "SOC, AppSec, DFIR, Python, TypeScript";

export const skillsData = [
  {
    id: 1,
    name: "OWASP / SAST",
    description: "Классы уязвимостей и статический анализ",
    icon: FaShieldAlt,
    color: colors.accent[600],
    category: "security" as const,
  },
  {
    id: 2,
    name: "DFIR",
    description: "Triage, логи, timeline analysis",
    icon: SiWireshark,
    color: colors.accent[700],
    category: "security" as const,
  },
  {
    id: 3,
    name: "MITRE ATT&CK",
    description: "Карта техник для разбора атак",
    icon: FaBug,
    color: colors.accent[800],
    category: "security" as const,
  },
  {
    id: 4,
    name: "Burp Suite",
    description: "Web exploitation и проверка контролей",
    icon: SiBurpsuite,
    color: colors.accent[500],
    category: "offensive" as const,
  },
  {
    id: 5,
    name: "Python",
    description: "Автоматизация и AppSec-инструменты",
    icon: FaPython,
    color: colors.semantic.success.DEFAULT,
    category: "development" as const,
  },
  {
    id: 6,
    name: "TypeScript",
    description: "Типобезопасный код и SDK",
    icon: SiTypescript,
    color: colors.accent[700],
    category: "development" as const,
  },
  {
    id: 7,
    name: "FastAPI",
    description: "API для security-tooling",
    icon: SiFastapi,
    color: colors.accent[600],
    category: "development" as const,
  },
  {
    id: 8,
    name: "React",
    description: "UI-бэкграунд для secure review",
    icon: FaReact,
    color: colors.accent[600],
    category: "development" as const,
  },
  {
    id: 9,
    name: "Git",
    description: "Контроль версий и ревью",
    icon: FaGitAlt,
    color: colors.accent[600],
    category: "development" as const,
  },
];

export const skillGroups = [
  {
    title: "Security & DFIR",
    items: ["OWASP Top 10", "SAST", "Incident Response", "DFIR", "MITRE ATT&CK", "Wireshark"],
  },
  {
    title: "Offensive / практика",
    items: ["Burp Suite", "Web exploitation", "JWT / SSRF", "HackTheBox"],
  },
  {
    title: "Development",
    items: ["Python", "FastAPI", "TypeScript", "React", "Docker", "Git"],
  },
] as const;
