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
    { type: "feat", text: "Ясный сигнал роли важнее общего портфолио-шума" },
    { type: "a11y", text: "Публично — возможности и стек, без чужих инцидентов" },
    { type: "perf", text: "Инструменты и проверки должны выдерживать реальный код" },
  ],
} as const;
