import { IconType } from "react-icons";
import { MdEmail } from "react-icons/md";
import { FaGithub, FaTelegram } from "react-icons/fa";

export interface ContactInfo {
  label: string;
  value: string;
  link?: string;
  icon: IconType;
}

export const contactsData: ContactInfo[] = [
  {
    label: "Email",
    value: "inbox@ktkv.me",
    link: "inbox@ktkv.me",
    icon: MdEmail,
  },
  // {
  //   label: "LinkedIn",
  //   value: "linkedin.com/in/",
  //   link: "",
  //   icon: FaLinkedin,
  // },
  {
    label: "GitHub",
    value: "github.com/kotru21",
    link: "https://github.com/kotru21",
    icon: FaGithub,
  },
  {
    label: "Telegram",
    value: "@arsenij_kotikov",
    link: "https://t.me/arsenij_kotikov",
    icon: FaTelegram,
  },
];
