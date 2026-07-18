import { footerInfo, footerSocialLinks, navigation } from "@/shared/config/content";
import { Section } from "@/shared/ui";

import { FooterBottom, FooterInfo, FooterNavigation, FooterSocial } from "./ui";

export function FooterWidget(): React.JSX.Element {
  return (
    <Section
      as="footer"
      spacing="footer"
      backgroundClassName="bg-background-primary dark:bg-background-tertiary"
      className="border-t-4 border-black dark:border-white"
    >
      <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />

      <div className="grid gap-8 text-center md:grid-cols-3 md:text-left">
        <FooterInfo title={footerInfo.title} description={footerInfo.description} />
        <FooterNavigation title={footerInfo.navTitle} links={navigation} />
        <FooterSocial title={footerInfo.socialTitle} socialLinks={footerSocialLinks} />
      </div>

      <FooterBottom year={footerInfo.copyrightYear} brand={footerInfo.title} />
    </Section>
  );
}
