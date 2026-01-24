import React from "react";

import type { SocialLink } from "@/entities/navigation";
import { colors } from "@/styles/colors";

interface FooterSocialProps {
  title: string;
  socialLinks: SocialLink[];
}

const FooterSocial: React.FC<FooterSocialProps> = ({ title, socialLinks }) => {
  const accentShadowStyle = {
    "--accent-shadow": colors.primary[500],
  } as React.CSSProperties & Record<"--accent-shadow", string>;

  return (
    <div className="space-y-4">
      <h3 className="text-text-primary dark:text-text-primary mb-4 text-xl font-bold uppercase">
        {title}
      </h3>
      <div className="flex flex-wrap justify-center gap-4 md:justify-start">
        {socialLinks.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
            title={link.name}
          >
            <div
              style={accentShadowStyle}
              className="flex h-12 w-12 items-center justify-center border-2 border-black bg-transparent transition-all duration-300 hover:bg-black hover:shadow-[4px_4px_0px_0px_var(--accent-shadow)] dark:border-white dark:hover:bg-white"
            >
              <link.icon className="h-5 w-5 text-black transition-colors group-hover:text-white dark:text-white dark:group-hover:text-black" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default FooterSocial;
