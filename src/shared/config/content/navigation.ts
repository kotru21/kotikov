/**
 * In-page navigation anchors. Canonical in `@/shared/config/content`;
 * `entities/navigation` re-exports types only (no data shell).
 *
 * Social icon links live in `footerSocial.ts` so consumers of `navigation`
 * do not pull `react-icons` into their module graph.
 */

export interface NavigationItem {
  name: string;
  href: string;
}

export const navigation = [
  { name: "Главная", href: "#header" },
  { name: "Обо мне", href: "#about" },
  { name: "Проекты", href: "#projects" },
  { name: "Навыки", href: "#skills" },
  { name: "Опыт", href: "#experience" },
  { name: "Контакты", href: "#contacts" },
] as const satisfies readonly NavigationItem[];
