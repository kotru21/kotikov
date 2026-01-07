import React from "react";

import type { NavigationItem } from "@/entities/navigation";

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
      <h3 className="text-xl font-bold text-text-primary dark:text-text-primary uppercase mb-4">{title}</h3>
      <div className="flex flex-col space-y-2">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="text-text-secondary dark:text-gray-400 hover:text-[#d12c1f] dark:hover:text-[#f4bf21] transition-colors duration-200 text-sm font-bold">
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default FooterNavigation;
