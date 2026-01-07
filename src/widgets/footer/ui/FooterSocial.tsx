import React from "react";

import type { SocialLink } from "@/entities/navigation";

interface FooterSocialProps {
  title: string;
  socialLinks: SocialLink[];
}

const FooterSocial: React.FC<FooterSocialProps> = ({ title, socialLinks }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-text-primary dark:text-text-primary uppercase mb-4">{title}</h3>
      <div className="flex flex-wrap justify-center md:justify-start gap-4">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
            title={link.name}>
            <div className="w-12 h-12 border-2 border-black dark:border-white bg-transparent hover:bg-black dark:hover:bg-white flex items-center justify-center transition-all duration-300 hover:shadow-[4px_4px_0px_0px_#d12c1f] dark:hover:shadow-[4px_4px_0px_0px_#f4bf21]">
              <link.icon className="w-5 h-5 text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default FooterSocial;
