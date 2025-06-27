import React from "react";
import { colors } from "../../styles/colors";

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
    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
      {announcement && (
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div
            style={{
              color: colors.text.muted,
              borderColor: colors.border.dark,
            }}
            className="relative rounded-full px-3 py-1 text-sm/6 ring-1 hover:ring-gray-900/20">
            {announcement.text}{" "}
            <a
              href={announcement.linkHref}
              style={{ color: colors.primary[600] }}
              className="font-semibold">
              <span aria-hidden="true" className="absolute inset-0" />
              {announcement.linkText} <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      )}

      <div className="text-center">
        <h1
          style={{ color: colors.text.primary }}
          className="text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
          {title}
        </h1>
        <p
          style={{ color: colors.text.muted }}
          className="mt-8 text-lg font-medium text-pretty sm:text-xl/8">
          {subtitle}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href={buttons.primary.href}
            style={{
              backgroundColor: colors.primary[600],
              color: colors.text.primary,
            }}
            className="rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 transition-opacity">
            {buttons.primary.text}
          </a>
          <a
            href={buttons.secondary.href}
            style={{ color: colors.text.tertiary }}
            className="text-sm/6 font-semibold hover:text-white transition-colors">
            {buttons.secondary.text} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeaderHero;
