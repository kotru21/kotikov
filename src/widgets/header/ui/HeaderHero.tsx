import React from "react";

import { InteractiveElement, InteractiveText } from "@/features/interactive-elements";
import { Button } from "@/shared/ui";
import { colors } from "@/styles/colors";

interface HeaderHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  buttons: {
    primary: { text: string; href: string };
    secondary: { text: string; href: string };
  };
}

const HeaderHero: React.FC<HeaderHeroProps> = ({ eyebrow, title, subtitle, buttons }) => {
  return (
    <div className="relative isolate mx-auto w-full max-w-2xl py-8 sm:py-12 lg:py-16">
      <div className="bg-primary-500 absolute top-0 right-0 -z-10 size-24 translate-x-1/3 -translate-y-1/3 rounded-full opacity-80 mix-blend-multiply blur-sm sm:size-32 sm:translate-x-1/2 sm:-translate-y-1/2 dark:mix-blend-screen" />

      <div className="relative z-10">
        <p className="text-text-primary dark:text-text-inverse mb-3 inline-block max-w-full border-2 border-black border-l-4 border-l-primary-500 bg-background-primary px-2.5 py-1 text-[0.65rem] font-bold tracking-[0.14em] uppercase sm:px-3 sm:text-sm sm:tracking-[0.28em] dark:border-white dark:border-l-primary-400 dark:bg-background-tertiary">
          {eyebrow}
        </p>

        <div className="flex flex-col items-start">
          <h1 className="text-text-primary dark:text-text-inverse text-[2.75rem] leading-[0.95] font-black tracking-tight uppercase sm:text-6xl sm:leading-none lg:text-8xl">
            <InteractiveText text={title} />
          </h1>
          <InteractiveElement
            data-interactive-mode="solid"
            className="bg-primary-500 my-4 h-3 w-16 sm:my-6 sm:h-4 sm:w-24"
          />
          <InteractiveElement
            as="p"
            data-interactive-mode="border"
            className="text-text-secondary border-primary-700 dark:border-primary-300 mt-1 max-w-full border-l-4 pl-4 text-base leading-7 font-bold sm:mt-2 sm:max-w-xl sm:pl-6 sm:text-xl sm:leading-8 dark:text-neutral-300"
          >
            <InteractiveText text={subtitle} />
          </InteractiveElement>
          <div className="mt-8 flex w-full flex-col gap-4 sm:mt-10 sm:w-auto sm:flex-row sm:items-center sm:gap-x-6">
            <InteractiveElement
              as={Button}
              data-interactive-mode="solid"
              href={buttons.primary.href}
              variant="primary"
              size="lg"
              fullWidth
              shadowColor={colors.primary[500]}
              className="sm:w-auto dark:border-white dark:bg-black dark:text-white"
            >
              {buttons.primary.text}
            </InteractiveElement>

            <a
              href={buttons.secondary.href}
              className="text-text-primary dark:text-text-inverse group inline-flex items-center justify-center gap-1 text-sm leading-6 font-semibold sm:justify-start"
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
