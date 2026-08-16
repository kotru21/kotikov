import { FaLinkedin } from "react-icons/fa";

import { InteractiveText } from "@/features/interactive-elements/client";
import { aboutContent, social } from "@/shared/config/content";
import { formatExternalLinkLabel, isSafeHref } from "@/shared/lib";
import {
  CELL_HOVER,
  GIANT_LABEL,
  GRID_DIVIDE,
  GRID_STROKE,
  GRID_SURFACE,
  Section,
  TEAL_FILL,
} from "@/shared/ui";

import { AboutPaintSurface, AboutSpecGrid } from "./ui";

const LINKEDIN_LINK_CLASS = `${GRID_STROKE} ${TEAL_FILL} ${CELL_HOVER} inline-flex min-h-11 w-fit cursor-pointer items-center gap-1.5 px-4 text-xs font-bold uppercase focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#111] dark:focus-visible:ring-[#ededed]`;

function AboutLinkedInLink(): React.JSX.Element | null {
  if (!isSafeHref(social.linkedin.url)) return null;
  return (
    <a
      href={social.linkedin.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={formatExternalLinkLabel("LinkedIn")}
      className={LINKEDIN_LINK_CLASS}
    >
      <FaLinkedin aria-hidden="true" /> LinkedIn
    </a>
  );
}

/** About section composition root (Server Component). Paint lives in AboutPaintSurface. */
export function AboutWidget(): React.JSX.Element {
  return (
    <Section id="about" contained={false} spacing="none" backgroundClassName={GRID_SURFACE}>
      <AboutPaintSurface>
        <div
          className={`${GRID_DIVIDE} grid items-stretch md:grid-cols-2 md:divide-x-2 md:divide-y-0`}
        >
          <div className="flex h-full min-h-0 min-w-0 flex-col justify-center gap-6 p-6 md:p-10 md:pb-16">
            <h2 className={GIANT_LABEL} id="about-heading">
              <InteractiveText contrast="solid" text={aboutContent.title} />
            </h2>
            <p className="text-base leading-8 font-medium text-[#111] dark:text-[#ededed]">
              <InteractiveText text={aboutContent.body} />
            </p>
            <AboutLinkedInLink />
          </div>
          <AboutSpecGrid />
        </div>
      </AboutPaintSurface>
    </Section>
  );
}
