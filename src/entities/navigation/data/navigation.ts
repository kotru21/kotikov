import type {
  NavigationItem,
  SocialLink,
} from "@/entities/navigation/model/types";
import { FaGithub, FaLinkedin, FaTelegram, FaEnvelope } from "react-icons/fa";

export const navigation: NavigationItem[] = [
  { name: "Главная", href: "#header" },
  { name: "Навыки", href: "#skills" },
  { name: "Опыт", href: "#timeline" },
  { name: "Контакты", href: "#contacts" },
];

export const footerSocialLinks: SocialLink[] = [
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
    url: "mailto:inbox@ktkv.me",
    icon: FaEnvelope,
  },
];
