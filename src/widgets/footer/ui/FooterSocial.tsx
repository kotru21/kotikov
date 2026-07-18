import type { SocialLink } from "@/entities/navigation";
import { formatExternalLinkLabel, isHttpUrl } from "@/shared/lib";
import { colors } from "@/styles/colors";

interface FooterSocialProps {
  title: string;
  socialLinks: readonly SocialLink[];
}

function getSocialLinkAccessibleName(link: SocialLink, opensNewTab: boolean): string {
  if (opensNewTab) return formatExternalLinkLabel(link.name);
  if (/^mailto:/i.test(link.url)) return "Написать по электронной почте";

  return link.name;
}

export function FooterSocial({ title, socialLinks }: FooterSocialProps): React.JSX.Element {
  const accentShadowStyle = {
    "--accent-shadow": colors.primary[500],
  } as React.CSSProperties & Record<"--accent-shadow", string>;

  return (
    <div className="space-y-4">
      <h3 className="text-text-primary dark:text-text-inverse mb-4 text-xl font-bold uppercase">
        {title}
      </h3>
      <div className="flex flex-wrap justify-center gap-4 md:justify-start">
        {socialLinks.map((link) => {
          const opensNewTab = isHttpUrl(link.url);
          const accessibleName = getSocialLinkAccessibleName(link, opensNewTab);

          return (
            <a
              key={link.url}
              href={link.url}
              target={opensNewTab ? "_blank" : undefined}
              rel={opensNewTab ? "noopener noreferrer" : undefined}
              className="group focus-visible:ring-primary-500 relative inline-flex min-h-11 min-w-11 items-center justify-center focus-visible:ring-2 focus-visible:outline-none"
              title={accessibleName}
              aria-label={accessibleName}
            >
              <div
                aria-hidden="true"
                style={accentShadowStyle}
                className="flex h-12 w-12 items-center justify-center border-2 border-black bg-transparent transition-all duration-300 hover:bg-black hover:shadow-[4px_4px_0px_0px_var(--accent-shadow)] dark:border-white dark:hover:bg-white"
              >
                <link.icon className="h-5 w-5 text-black transition-colors group-hover:text-white dark:text-white dark:group-hover:text-black" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
