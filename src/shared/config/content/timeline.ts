export const timelineData = [
  {
    id: 1,
    title: "SOC Analyst Intern",
    company: "hoster.by",
    period: "2026 — н.в.",
    description:
      "Практика в SOC: triage и DFIR на Windows/Linux, разбор логов и сетевого трафика, ведение кейсов. Стек на уровне категорий — timeline analysis, network forensics, IR-платформа. Без публичных деталей клиентских инцидентов.",
    technologies: ["DFIR", "IR", "MITRE ATT&CK", "Wireshark"],
    type: "work" as const,
  },
  {
    id: 2,
    title: "Frontend Developer Intern",
    company: "Innowise",
    period: "июн 2025 — ноя 2025",
    description:
      "Инженерный бэкграунд: React/TypeScript-приложения, качество кода и командная поставка. Опыт чтения и сборки UI помогает в AppSec и code review.",
    technologies: ["React", "TypeScript", "GraphQL"],
    type: "work" as const,
  },
  {
    id: 3,
    title: "Информационная безопасность",
    company: "БГУИР",
    period: "2024 — н.в.",
    description: "Бакалавриат по информационной безопасности (3 курс, выпуск 2028).",
    technologies: ["InfoSec", "Cryptography"],
    type: "education" as const,
  },
];
