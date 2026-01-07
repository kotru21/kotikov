import React from "react";


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
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#d12c1f] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-80 -z-10 translate-x-1/2 -translate-y-1/2 blur-sm"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#1b54a7] rotate-45 mix-blend-multiply dark:mix-blend-screen opacity-80 -z-10 translate-x-[-30%] translate-y-[20%]"></div>
      
      {announcement && (
        <div className="hidden sm:mb-8 sm:flex">
          <div
            className="relative px-4 py-1.5 text-sm font-bold leading-6 text-gray-900 dark:text-gray-100 border-2 border-black dark:border-white bg-[#f4bf21] dark:bg-[#b45309] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all duration-200">
            {announcement.text}{" "}
            <a
              href={announcement.linkHref}
              className="font-black text-black dark:text-white underline decoration-2">
              <span aria-hidden="true" className="absolute inset-0" />
              {announcement.linkText} <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      )}

      <div className="flex flex-col items-start relative z-10">
        <h1
          className="text-6xl font-black tracking-tight text-[#111111] dark:text-[#f5f5f3] sm:text-8xl drop-shadow-none uppercase">
          {title}
        </h1>
        <div className="w-24 h-4 bg-[#d12c1f] my-6"></div>
        <p
          className="mt-2 text-xl font-bold leading-8 text-[#424242] dark:text-[#d4d4d4] max-w-xl border-l-4 border-[#1b54a7] dark:border-[#63b3ed] pl-6">
          {subtitle}
        </p>
        <div className="mt-10 flex items-center gap-x-6">
          <a
            href={buttons.primary.href}
            className="rounded-none bg-[#111111] dark:bg-[#f5f5f3] px-6 py-4 text-sm font-bold text-[#f5f5f3] dark:text-[#111111] shadow-[8px_8px_0px_0px_#d12c1f] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_#d12c1f] transition-all border-2 border-black dark:border-white">
            {buttons.primary.text}
          </a>
          <a
            href={buttons.secondary.href}
            className="text-sm font-bold leading-6 text-[#111111] dark:text-[#f5f5f3] hover:text-[#d12c1f] dark:hover:text-[#f4bf21] transition-colors flex items-center gap-2 group border-b-2 border-black dark:border-white pb-1">
            {buttons.secondary.text} <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeaderHero;
