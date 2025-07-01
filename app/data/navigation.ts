import { NavigationItem } from "../types";

export const navigation: NavigationItem[] = [
  { name: "Главная", href: "#header" },
  { name: "Навыки", href: "#skills" },
  { name: "Опыт", href: "#timeline" },
  { name: "Контакты", href: "#contacts" },
];

export const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/kotru21",
    icon: "FaGithub",
  },
  // {
  //   name: "LinkedIn",
  //   url: "https://linkedin.com/in/yourprofile",
  //   icon: "FaLinkedin",
  // },
  {
    name: "Telegram",
    url: "https://t.me/kotikovdev",
    icon: "FaTelegram",
  },
  {
    name: "Email",
    url: "mailto:inbox@ktkv.me",
    icon: "FaEnvelope",
  },
];
