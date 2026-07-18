/**
 * Contact section content. Canonical in `@/shared/config/content`; entity
 * re-exports `ContactInfo` for consumers (type facade only).
 */
import type { ComponentType } from "react";
import { FaGithub, FaTelegram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import { social } from "./social";

export type ContactLayout = "hero" | "secondary-light" | "secondary-dark";

export interface ContactInfo {
  label: string;
  value: string;
  link?: string;
  icon: ComponentType<{ className?: string }>;
  layout: ContactLayout;
}

export const contactsData = [
  {
    label: "Email",
    value: social.email.display,
    link: social.email.mailto,
    icon: MdEmail,
    layout: "hero",
  },
  {
    label: "Telegram",
    value: social.telegram.display,
    link: social.telegram.url,
    icon: FaTelegram,
    layout: "secondary-light",
  },
  {
    label: "GitHub",
    value: social.github.display,
    link: social.github.url,
    icon: FaGithub,
    layout: "secondary-dark",
  },
] as const satisfies readonly ContactInfo[];
