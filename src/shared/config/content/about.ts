export const aboutContent = {
  title: "Коротко обо мне",
  body: "Меня зовут Арсений Котиков (Kotikov). Я фронтенд-разработчик из Беларуси. Люблю, когда интерфейс ощущается продуманным: чёткая иерархия, аккуратная анимация и надёжная реализация. Учусь в БГУИР, в проде успел поработать в Innowise.",
  spec: {
    fileName: "about.ts",
    exportName: "kotikov",
    fields: [
      { key: "name", value: "Арсений Котиков" },
      { key: "handle", value: "Kotikov" },
      { key: "role", value: "frontend" },
      { key: "location", value: "Беларусь" },
      { key: "education", value: "БГУИР" },
      { key: "experience", value: "Innowise" },
    ],
  },
  principles: [
    { type: "feat", text: "Читаемые системы важнее визуального шума" },
    { type: "a11y", text: "Анимация поддерживает иерархию, а не отвлекает" },
    { type: "perf", text: "Продуктовый UI остаётся быстрым под нагрузкой" },
  ],
} as const;
