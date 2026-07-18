import type { ComponentType } from "react";
import { FaBug, FaGitAlt, FaPython, FaReact, FaShieldAlt } from "react-icons/fa";
import { SiBurpsuite, SiFastapi, SiTypescript, SiWireshark } from "react-icons/si";

import { colors } from "@/styles/colors";

/**
 * Skills content. Canonical data lives in shared/config; `entities/skill` re-exports
 * `SkillData` for widget consumers (type facade only).
 */
export type SkillCategory = "security" | "offensive" | "development";

export interface SkillData {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: ComponentType<{ className?: string }>;
  category: SkillCategory;
}

/** Subtitle under the Skills heading — InfoSec stack, not frontend marketing. */
export const skillsStackLine = "SOC, AppSec, DFIR, Python, TypeScript";

export const skillsData = [
  {
    id: 1,
    name: "OWASP / SAST",
    description: "Классы уязвимостей и статический анализ",
    icon: FaShieldAlt,
    color: colors.accent[600],
    category: "security",
  },
  {
    id: 2,
    name: "DFIR",
    description: "Triage, логи, timeline analysis",
    icon: SiWireshark,
    color: colors.accent[700],
    category: "security",
  },
  {
    id: 3,
    name: "MITRE ATT&CK",
    description: "Карта техник для разбора атак",
    icon: FaBug,
    color: colors.accent[800],
    category: "security",
  },
  {
    id: 4,
    name: "Burp Suite",
    description: "Web exploitation и проверка контролей",
    icon: SiBurpsuite,
    color: colors.accent[500],
    category: "offensive",
  },
  {
    id: 5,
    name: "Python",
    description: "Автоматизация и AppSec-инструменты",
    icon: FaPython,
    color: colors.semantic.success.DEFAULT,
    category: "development",
  },
  {
    id: 6,
    name: "TypeScript",
    description: "Типобезопасный код и SDK",
    icon: SiTypescript,
    color: colors.accent[700],
    category: "development",
  },
  {
    id: 7,
    name: "FastAPI",
    description: "API для security-tooling",
    icon: SiFastapi,
    color: colors.accent[600],
    category: "development",
  },
  {
    id: 8,
    name: "React",
    description: "UI-бэкграунд для secure review",
    icon: FaReact,
    color: colors.accent[600],
    category: "development",
  },
  {
    id: 9,
    name: "Git",
    description: "Контроль версий и ревью",
    icon: FaGitAlt,
    color: colors.accent[600],
    category: "development",
  },
] as const satisfies readonly SkillData[];

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
