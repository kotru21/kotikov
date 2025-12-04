import type { ContactInfo } from "@/entities/contact/model/types";
import { MdEmail } from "react-icons/md";
import { FaGithub, FaTelegram } from "react-icons/fa";

export const contactsData: ContactInfo[] = [
  {
    label: "Email",
    value: "inbox@ktkv.me",
    link: "mailto:inbox@ktkv.me",
    icon: MdEmail,
  },
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
