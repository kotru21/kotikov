import { footerInfo } from "@/shared/config/content";
import { Section, TEAL_FILL } from "@/shared/ui";

export function FooterWidget(): React.JSX.Element {
  return (
    <Section as="footer" contained={false} spacing="none" backgroundClassName={TEAL_FILL}>
      <p className="px-6 py-3 text-sm font-medium">
        {footerInfo.title} © {footerInfo.copyrightYear}
      </p>
    </Section>
  );
}
