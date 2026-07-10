const skipLinkClassName =
  "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:z-100 focus:border-2 focus:border-black focus:bg-white focus:px-4 focus:py-2 focus:font-bold dark:focus:border-white dark:focus:bg-black dark:focus:text-white";

export function SkipLinks(): React.JSX.Element {
  return (
    <nav aria-label="Быстрый переход">
      <a href="#main-content" className={`${skipLinkClassName} focus:left-4`}>
        К основному содержимому
      </a>
      <a href="#projects" className={`${skipLinkClassName} focus:left-56`}>
        К проектам
      </a>
    </nav>
  );
}
