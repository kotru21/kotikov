import React from "react";

import { footerInfo, footerSocialLinks, navigation } from "@/shared/config/content";

import { FooterBottom, FooterInfo, FooterNavigation, FooterSocial } from "./ui";

const FooterWidget: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-primary dark:bg-background-tertiary relative border-t-4 border-black px-6 py-12 transition-colors duration-300 dark:border-white">
      <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 text-center md:grid-cols-3 md:text-left">
          {/* Левая секция - Информация */}
          <FooterInfo title={footerInfo.title} description={footerInfo.description} />

          {/* Центральная секция - Быстрые ссылки */}
          <FooterNavigation title="Быстрые ссылки" links={navigation} />

          {/* Правая секция - Социальные сети */}
          <FooterSocial title="Связаться со мной" socialLinks={footerSocialLinks} />
        </div>

        <FooterBottom year={currentYear} />
      </div>
    </footer>
  );
};

export default FooterWidget;
