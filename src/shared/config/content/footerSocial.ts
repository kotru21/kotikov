/**
 * Footer social links with icons. Kept separate from `navigation.ts` so
 * header/nav consumers do not import `react-icons`.
 */
import type { ComponentType } from "react";
import { FaEnvelope, FaGithub, FaLinkedin, FaTelegram } from "react-icons/fa";

import { social } from "./social";

export interface SocialLink {
  name: string;
  url: string;
  icon: ComponentType<{ className?: string }>;
}

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
