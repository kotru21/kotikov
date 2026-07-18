/**
 * Timeline section content. Canonical in `@/shared/config/content`; entity
 * re-exports `TimelineItem` for consumers (type facade only).
 */
export type TimelineItemType = "work" | "education" | "hackathon";

export interface TimelineItem {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  type: TimelineItemType;
}

export const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: "SOC Analyst Intern",
    company: "hoster.by",
    period: "2026 — н.в.",
    description:
      "Практика в SOC: triage и DFIR на Windows/Linux, разбор логов и сетевого трафика, ведение кейсов. Стек на уровне категорий — timeline analysis, network forensics, IR-платформа. Без публичных деталей клиентских инцидентов.",
    technologies: ["DFIR", "IR", "MITRE ATT&CK", "Wireshark"],
    type: "work",
  },
  {
    id: 2,
    title: "MTS Hackathon",
    company: "MTS",
    period: "2026",
    description:
      "IaaS-платформа за сжатые сроки: модель доступа к ресурсам, границы доверия между API и UI, безопасные дашборды управления инфраструктурой.",
    technologies: ["IAM", "API Security", "Access Control", "React"],
    type: "hackathon",
  },
  {
    id: 3,
    title: "Frontend Developer Intern",
    company: "Innowise",
    period: "июн 2025 — ноя 2025",
    description:
      "Инженерный бэкграунд: React/TypeScript-приложения, качество кода и командная поставка. Опыт чтения и сборки UI помогает в AppSec и code review.",
    technologies: ["React", "TypeScript", "GraphQL"],
    type: "work",
  },
  {
    id: 4,
    title: "Информационная безопасность",
    company: "БГУИР",
    period: "2024 — н.в.",
    description: "Бакалавриат по информационной безопасности (3 курс, выпуск 2028).",
    technologies: ["InfoSec", "Cryptography"],
    type: "education",
  },
  {
    id: 5,
    title: "ByChange Hackathon",
    company: "ByChange",
    period: "2023",
    description:
      "Приложение мониторинга здоровья: защита персональных данных, authn/authz на API, минимизация чувствительных полей на клиенте и в ответах бэкенда.",
    technologies: ["AuthN/Z", "Data Privacy", "API Security", "React"],
    type: "hackathon",
  },
];
