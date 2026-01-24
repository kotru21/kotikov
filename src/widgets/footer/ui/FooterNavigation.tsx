import React from "react";

import type { NavigationItem } from "@/entities/navigation";

interface FooterNavigationProps {
  title: string;
  links: NavigationItem[];
}

const FooterNavigation: React.FC<FooterNavigationProps> = ({ title, links }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-text-primary dark:text-text-primary mb-4 text-xl font-bold uppercase">
        {title}
      </h3>
      <div className="flex flex-col space-y-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-text-secondary hover:text-primary-700 dark:hover:text-primary-300 text-sm font-bold transition-colors duration-200 dark:text-gray-400"
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default FooterNavigation;
