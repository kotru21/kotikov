export const aboutContent = {
  title: "Коротко обо мне",
  body: "Меня зовут Арсений Котиков (Kotikov). Студент информационной безопасности в БГУИР, Intern SOC в hoster.by. Параллельно углубляюсь в AppSec: SAST, разбор уязвимостей и secure code review. Фронтенд-опыт помогает видеть, как дыры появляются в реальном коде.",
  spec: {
    fileName: "about.ts",
    exportName: "kotikov",
    fields: [
      { key: "name", value: "Арсений Котиков" },
      { key: "handle", value: "Kotikov" },
      { key: "role", value: "SOC / AppSec" },
      { key: "location", value: "Беларусь" },
      { key: "education", value: "БГУИР · ИБ" },
      { key: "experience", value: "hoster.by" },
    ],
  },
  principles: [
    { type: "feat", text: "Чёткий сигнал роли важнее портфолио-шума" },
    { type: "a11y", text: "Публично — навыки и стек, без чужих инцидентов" },
    { type: "perf", text: "Проверки и инструменты должны держать реальный код" },
  ],
} as const;
