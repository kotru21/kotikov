import { FaEnvelope, FaGithub, FaLinkedin, FaTelegram } from "react-icons/fa";

import { social } from "./social";

export const navigation = [
  { name: "Главная", href: "#header" },
  { name: "Навыки", href: "#skills" },
  { name: "Опыт", href: "#timeline" },
  { name: "Контакты", href: "#contacts" },
];

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
];
