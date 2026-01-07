import { FaGithub, FaTelegram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import { social } from "./social";

export const contactsData = [
  {
    label: "Email",
    value: social.email.display,
    link: social.email.mailto,
    icon: MdEmail,
  },
  {
    label: "GitHub",
    value: social.github.display,
    link: social.github.url,
    icon: FaGithub,
  },
  {
    label: "Telegram",
    value: social.telegram.display,
    link: social.telegram.url,
    icon: FaTelegram,
  },
];
