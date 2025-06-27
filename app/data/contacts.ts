import { IconType } from "react-icons";
import { MdEmail } from "react-icons/md";
import { FaLinkedin, FaGithub, FaTelegram } from "react-icons/fa";

export interface ContactInfo {
  label: string;
  value: string;
  link?: string;
  icon: IconType;
}

export const contactsData: ContactInfo[] = [
  {
    label: "Email",
    value: "mail@kotikov.is-a.dev",
    link: "mailto:mail@kotikov.is-a.dev",
    icon: MdEmail,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/",
    link: "",
    icon: FaLinkedin,
  },
  {
    label: "GitHub",
    value: "github.com/kotru21",
    link: "https://github.comkotru21",
    icon: FaGithub,
  },
  {
    label: "Telegram",
    value: "@arsenij_kotikov",
    link: "https://t.me/arsenij_kotikov",
    icon: FaTelegram,
  },
];
