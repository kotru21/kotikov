import React from "react";

import {
  footerInfo,
  footerSocialLinks,
  navigation,
} from "@/shared/config/content";

import {
  FooterBottom,
  FooterCat,
  FooterInfo,
  FooterNavigation,
  FooterSocial,
} from "./ui";

const FooterWidget: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative py-12 px-6 bg-background-primary dark:bg-background-tertiary transition-colors duration-300 border-t-4 border-black dark:border-white">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-black/20 dark:via-white/20 to-transparent"></div>

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Левая секция - Информация */}
          <FooterInfo
            title={footerInfo.title}
            description={footerInfo.description}
          />

          {/* Центральная секция - Быстрые ссылки */}
          <FooterNavigation
            title="Быстрые ссылки"
            links={navigation}
          />

          {/* Правая секция - Социальные сети */}
          <FooterSocial
            title="Связаться со мной"
            socialLinks={footerSocialLinks}
          />
        </div>

        <FooterBottom
          year={currentYear}
        />

        <FooterCat />
      </div>

    </footer>
  );
};

export default FooterWidget;
