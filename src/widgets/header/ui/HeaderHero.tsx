import { ArrowRightIcon } from "@heroicons/react/24/outline";

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

export function HeaderHero({
  eyebrow,
  title,
  subtitle,
  buttons,
}: HeaderHeroProps): React.JSX.Element {
  return (
    <div className="relative isolate mx-auto w-full max-w-2xl py-8 sm:py-12 lg:py-16">
      <p className="text-text-primary dark:text-text-inverse border-l-primary-500 bg-background-primary dark:border-l-primary-400 dark:bg-background-tertiary mb-3 inline-block max-w-full border-2 border-l-4 border-black px-2.5 py-1 text-xs font-bold tracking-[0.14em] uppercase sm:px-3 sm:text-sm sm:tracking-[0.28em] dark:border-white">
        {eyebrow}
      </p>

      <div className="flex flex-col items-start">
        <h1 className="text-text-primary dark:text-text-inverse text-[clamp(3rem,10vw,7rem)] leading-[0.88] font-black tracking-[-0.06em] uppercase">
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
            data-interactive-bg={colors.primary[500]}
            data-interactive-text="black"
            data-interactive-shadow="var(--shadow-hard-sm)"
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
            className="text-text-primary dark:text-text-inverse group focus-visible:ring-primary-500 focus-visible:ring-offset-background-primary dark:focus-visible:ring-offset-background-tertiary inline-flex min-h-11 items-center justify-center gap-1 rounded-none text-sm leading-6 font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:justify-start"
          >
            <InteractiveText text={buttons.secondary.text} />{" "}
            <InteractiveElement
              as="span"
              aria-hidden="true"
              className="inline-block transition-transform group-hover:translate-x-1"
            >
              <ArrowRightIcon className="size-4" />
            </InteractiveElement>
          </a>
        </div>
      </div>
    </div>
  );
}
