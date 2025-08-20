import React from "react";
import { navigation } from "@/entities";

interface FooterSocialProps {
  title: string;
  socialLinks: navigation.SocialLink[];
}

const FooterSocial: React.FC<FooterSocialProps> = ({ title, socialLinks }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <div className="flex flex-wrap justify-center md:justify-start gap-4">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
            title={link.name}>
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-xl transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110 group-hover:shadow-lg">
              <link.icon className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {link.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default FooterSocial;
