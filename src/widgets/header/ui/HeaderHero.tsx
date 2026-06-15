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
    <div className="relative isolate mx-auto max-w-2xl py-12 lg:py-16">
      <div className="bg-primary-500 absolute top-0 right-0 -z-10 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 mix-blend-multiply blur-sm dark:mix-blend-screen" />

      <div className="relative z-10">
        <p className="text-text-primary dark:text-text-inverse mb-3 inline-block border-2 border-black border-l-4 border-l-primary-500 bg-background-primary px-3 py-1 text-sm font-bold tracking-[0.28em] uppercase dark:border-white dark:border-l-primary-400 dark:bg-background-tertiary">
          {eyebrow}
        </p>

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
