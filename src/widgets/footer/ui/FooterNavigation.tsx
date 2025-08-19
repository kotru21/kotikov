import React from "react";
import type { NavigationItem } from "@/entities/navigation/model/types";

interface FooterNavigationProps {
  title: string;
  links: NavigationItem[];
}

const FooterNavigation: React.FC<FooterNavigationProps> = ({
  title,
  links,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <div className="flex flex-col space-y-2">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="text-white/80 hover:text-white transition-colors duration-200 text-sm">
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default FooterNavigation;
