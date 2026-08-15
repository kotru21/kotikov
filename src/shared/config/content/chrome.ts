import { aboutContent } from "./about";
import { headerContent } from "./header";
import { projectsSection } from "./projects";
import { skillsData } from "./skill";
import { social } from "./social";

export type PuzzleCellId = "projects" | "contacts" | "about" | "experience";
export type ChromeItemId = PuzzleCellId | "home";
export type SectionTitleId = "about" | "projects" | "skills" | "experience" | "contacts";

export interface PuzzleCell {
  id: PuzzleCellId;
  href: "#projects" | "#contacts" | "#about" | "#experience";
  label: string;
  area: PuzzleCellId;
}

export interface ChromeNavItem {
  id: ChromeItemId;
  href: "#projects" | "#about" | "#header" | "#experience" | "#contacts";
  label: string;
  kind: "section" | "home";
}

export interface PuzzleTickers {
  top: string;
  left: string;
  bottom: string;
  right: string;
}

export const puzzleCells = [
  { id: "about", href: "#about", label: "Обо мне", area: "about" },
  { id: "contacts", href: "#contacts", label: "Контакты", area: "contacts" },
  { id: "projects", href: "#projects", label: "Проекты", area: "projects" },
  { id: "experience", href: "#experience", label: "Опыт", area: "experience" },
] as const satisfies readonly PuzzleCell[];

export const chromeNavItems = [
  { id: "about", href: "#about", label: "Обо мне", kind: "section" },
  { id: "projects", href: "#projects", label: "Проекты", kind: "section" },
  { id: "home", href: "#header", label: "Kotikov", kind: "home" },
  { id: "experience", href: "#experience", label: "Опыт", kind: "section" },
  { id: "contacts", href: "#contacts", label: "Контакты", kind: "section" },
] as const satisfies readonly ChromeNavItem[];

export const puzzleTickers = {
  top: headerContent.subtitle,
  left: "Арсений Котиков × SOC / AppSec × БГУИР × hoster.by",
  bottom: skillsData.map((s) => s.name).join(" × "),
  right: `ktkv.me × ${social.email.display} × ${social.github.display}`,
} as const satisfies PuzzleTickers;

export const sectionTitles = {
  about: aboutContent.title,
  projects: projectsSection.title,
  skills: "Мои навыки",
  experience: "Мой путь",
  contacts: "Напишите мне",
} as const satisfies Record<SectionTitleId, string>;
