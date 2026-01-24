import React from "react";

import { InteractiveElement, InteractiveText } from "@/features/interactive-elements";
import { Button } from "@/shared/ui";
import { colors } from "@/styles/colors";

interface HeaderHeroProps {
  title: string;
  subtitle: string;
  announcement?: {
    text: string;
    linkText: string;
    linkHref: string;
  };
  buttons: {
    primary: {
      text: string;
      href: string;
    };
    secondary: {
      text: string;
      href: string;
    };
  };
}

const HeaderHero: React.FC<HeaderHeroProps> = ({ title, subtitle, announcement, buttons }) => {
  return (
    <div className="relative isolate mx-auto max-w-2xl py-12 lg:py-16">
      <div className="bg-primary-500 absolute top-0 right-0 -z-10 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 mix-blend-multiply blur-sm dark:mix-blend-screen" />

      <div className="relative z-10">
        {announcement ? (
          <div className="hidden sm:mb-8 sm:flex">
            <InteractiveElement
              data-interactive-mode="solid"
              data-interactive-bg="black"
              data-interactive-text="white"
              data-interactive-shadow="4px 4px 0px 0px rgba(255,255,255,1)"
              className="bg-primary-200 dark:bg-primary-700 relative border-2 border-black px-4 py-1.5 text-sm leading-6 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:text-neutral-50 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
            >
              {announcement.text}{" "}
              <a
                href={announcement.linkHref}
                className="relative z-10 font-black text-inherit underline decoration-2 transition-colors"
              >
                <span aria-hidden="true" className="absolute inset-0" />
                {announcement.linkText} <span aria-hidden="true">&rarr;</span>
              </a>
            </InteractiveElement>
          </div>
        ) : null}

        <div className="flex flex-col items-start">
          <h1 className="text-text-primary dark:text-text-inverse text-6xl font-black tracking-tight uppercase drop-shadow-none sm:text-8xl">
            <InteractiveText text={title} />
          </h1>
          <InteractiveElement
            data-interactive-mode="solid"
            className="bg-primary-500 my-6 h-4 w-24"
          />
          <InteractiveElement
            as="p"
            data-interactive-mode="border"
            className="text-text-secondary border-primary-700 dark:border-primary-300 mt-2 max-w-xl border-l-4 pl-6 text-xl leading-8 font-bold dark:text-neutral-300"
          >
            <InteractiveText text={subtitle} />
          </InteractiveElement>
          <div className="mt-10 flex items-center gap-x-6">
            <InteractiveElement
              as={Button}
              data-interactive-mode="solid"
              href={buttons.primary.href}
              variant="primary"
              size="lg"
              shadowColor={colors.primary[500]}
              className="dark:border-white dark:bg-black dark:text-white"
            >
              {buttons.primary.text}
            </InteractiveElement>

            <a
              href={buttons.secondary.href}
              className="text-text-primary dark:text-text-inverse group text-sm leading-6 font-semibold"
            >
              <InteractiveText text={buttons.secondary.text} />{" "}
              <InteractiveElement
                as="span"
                aria-hidden="true"
                className="inline-block transition-transform group-hover:translate-x-1"
              >
                →
              </InteractiveElement>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderHero;
