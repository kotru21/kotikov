import { personData } from "./person";

/**
 * About section copy. Canonical in `@/shared/config/content` (no `entities/about`).
 * Entities are type/UI facades only — do not move domain copy into entities without
 * an explicit architecture change.
 */
export interface AboutSpecField {
  key: string;
  value: string;
}

export interface AboutContent {
  title: string;
  body: string;
  spec: {
    fileName: string;
    exportName: string;
    fields: readonly AboutSpecField[];
  };
  /** Screen-reader enrichment only — not rendered in the visible code panel. */
  principles: readonly string[];
}

export const aboutContent = {
  title: "Коротко обо мне",
  body: "Меня зовут Арсений Котиков (Kotikov). Студент информационной безопасности в БГУИР, Intern SOC в hoster.by. Параллельно углубляюсь в AppSec: SAST, разбор уязвимостей и secure code review. Фронтенд-опыт помогает видеть, как дыры появляются в реальном коде.",
  spec: {
    fileName: "about.ts",
    exportName: "kotikov",
    fields: [
      { key: "name", value: personData.nameRu },
      { key: "handle", value: personData.nickname },
      { key: "role", value: personData.jobTitle },
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
} as const satisfies AboutContent;
