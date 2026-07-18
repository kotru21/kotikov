/**
 * Navigation + footer social content. Canonical in `@/shared/config/content`;
 * `entities/navigation` re-exports types only (no data shell).
 */
import type { ComponentType } from "react";
import { FaEnvelope, FaGithub, FaLinkedin, FaTelegram } from "react-icons/fa";

import { social } from "./social";

export interface NavigationItem {
  name: string;
  href: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: ComponentType<{ className?: string }>;
}

export const navigation = [
  { name: "Главная", href: "#header" },
  { name: "Обо мне", href: "#about" },
  { name: "Проекты", href: "#projects" },
  { name: "Навыки", href: "#skills" },
  { name: "Опыт", href: "#experience" },
  { name: "Контакты", href: "#contacts" },
] as const satisfies readonly NavigationItem[];

export const footerSocialLinks = [
  {
    name: "GitHub",
    url: social.github.url,
    icon: FaGithub,
  },
  {
    name: "LinkedIn",
    url: social.linkedin.url,
    icon: FaLinkedin,
  },
  {
    name: "Telegram",
    url: social.telegram.url,
    icon: FaTelegram,
  },
  {
    name: "Email",
    url: social.email.mailto,
    icon: FaEnvelope,
  },
] as const satisfies readonly SocialLink[];
