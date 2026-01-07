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

const HeaderHero: React.FC<HeaderHeroProps> = ({
  title,
  subtitle,
  announcement,
  buttons,
}) => {
  return (
    <div className="mx-auto max-w-2xl py-12 lg:py-16 relative isolate">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-80 -z-10 translate-x-1/2 -translate-y-1/2 blur-sm"></div>
      
      <div className="relative z-10">
        {announcement && (
          <div className="hidden sm:mb-8 sm:flex">
            <InteractiveElement
              data-interactive-mode="solid"
              data-interactive-bg="black"
              data-interactive-text="white"
              data-interactive-shadow="4px 4px 0px 0px rgba(255,255,255,1)"
              className="relative px-4 py-1.5 text-sm font-bold leading-6 text-black dark:text-neutral-50 border-2 border-black dark:border-white bg-primary-200 dark:bg-primary-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all duration-200">
              {announcement.text}{" "}
              <a
                href={announcement.linkHref}
                className="font-black text-inherit underline decoration-2 relative z-10 transition-colors">
                <span aria-hidden="true" className="absolute inset-0" />
                {announcement.linkText} <span aria-hidden="true">&rarr;</span>
              </a>
            </InteractiveElement>
          </div>
        )}

        <div className="flex flex-col items-start">
        <h1
          className="text-6xl font-black tracking-tight text-text-primary dark:text-text-inverse sm:text-8xl drop-shadow-none uppercase">
          <InteractiveText text={title} />
        </h1>
        <InteractiveElement data-interactive-mode="solid" className="w-24 h-4 bg-primary-500 my-6" />
        <InteractiveElement as="p" data-interactive-mode="border"
          className="mt-2 text-xl font-bold leading-8 text-text-secondary dark:text-neutral-300 max-w-xl border-l-4 border-primary-700 dark:border-primary-300 pl-6">
          <InteractiveText text={subtitle} />
        </InteractiveElement>
        <div className="mt-10 flex items-center gap-x-6">
          <InteractiveElement as={Button}
            data-interactive-mode="solid"
            href={buttons.primary.href}
            variant="primary"
            size="lg"
            shadowColor={colors.primary[500]}
            className="dark:bg-black dark:text-white dark:border-white"
          >
            {buttons.primary.text}
          </InteractiveElement>

          <a
            href={buttons.secondary.href}
            className="text-sm font-semibold leading-6 text-text-primary dark:text-text-inverse group"
          >
           <InteractiveText text={buttons.secondary.text} />{" "}
           <InteractiveElement as="span" aria-hidden="true" className="group-hover:translate-x-1 transition-transform inline-block">
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
