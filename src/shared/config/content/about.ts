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
    "В SOC разбираю алерты и инциденты на реальной инфраструктуре, а не на учебных стендах.",
    "В AppSec опираюсь на SAST, разбор уязвимостей и secure code review в живом коде.",
    "Публично делюсь навыками и инструментами; чужие инциденты и чувствительные детали остаются закрытыми.",
  ],
} as const;
