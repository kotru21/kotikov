import { NavigationItem, SocialLink } from "../types";
import { FaGithub, FaLinkedin, FaTelegram, FaEnvelope } from "react-icons/fa";

export const footerInfo = {
  title: "Kotikov",
  description:
    "Добро пожаловать в мое портфолио! Здесь вы найдете информацию о моих проектах, навыках и опыте работы в сфере разработки.",
};

export const footerNavigation = {
  title: "Быстрые ссылки",
  links: [
    { name: "Главная", href: "#header" },
    { name: "Навыки", href: "#skills" },
    { name: "Опыт работы", href: "#timeline" },
    { name: "Контакты", href: "#contacts" },
  ] as NavigationItem[],
};

export const footerSocial = {
  title: "Связаться со мной",
  links: [
    {
      name: "GitHub",
      url: "https://github.com/kotru21",
      icon: FaGithub,
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon: FaLinkedin,
    },
    {
      name: "Telegram",
      url: "https://t.me/arsenij_kotikov",
      icon: FaTelegram,
    },
    {
      name: "Email",
      url: "mailto:mail@kotikov.is-a.dev",
      icon: FaEnvelope,
    },
  ] as SocialLink[],
};

export const footerConfig = {
  version: "1.0.0",
};
