import React from "react";

import { footerInfo, footerSocialLinks, navigation } from "@/shared/config/content";
import { Section } from "@/shared/ui";

import { FooterBottom, FooterInfo, FooterNavigation, FooterSocial } from "./ui";

const FooterWidget: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Section
      as="footer"
      spacing="none"
      backgroundClassName="bg-background-primary dark:bg-background-tertiary"
      className="border-t-4 border-black py-16 dark:border-white"
    >
      <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />

      <div className="grid gap-8 text-center md:grid-cols-3 md:text-left">
        <FooterInfo title={footerInfo.title} description={footerInfo.description} />
        <FooterNavigation title="Быстрые ссылки" links={navigation} />
        <FooterSocial title="Связаться со мной" socialLinks={footerSocialLinks} />
      </div>

      <FooterBottom year={currentYear} />
    </Section>
  );
};

export default FooterWidget;
