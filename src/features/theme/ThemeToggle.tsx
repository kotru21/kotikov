"use client";

import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";

import { InteractiveElement } from "@/features/interactive-elements";

import { useHasMounted, useTheme } from "./ThemeProvider";

const ThemeToggle: React.FC = () => {
  const { isDark, toggle } = useTheme();
  const hasMounted = useHasMounted();

  let ariaLabel = "Переключить тему";
  if (hasMounted) {
    ariaLabel = isDark ? "Включить светлую тему" : "Включить тёмную тему";
  }

  return (
    <InteractiveElement
      as="button"
      type="button"
      onClick={toggle}
      data-draw-exclude
      aria-label={ariaLabel}
      aria-pressed={hasMounted ? isDark : undefined}
      className="hover:bg-primary-500 focus-visible:ring-accent-700 inline-flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-none border-2 border-black bg-white text-black transition-colors focus-visible:ring-2 focus-visible:outline-none dark:border-white dark:bg-black dark:text-white"
    >
      {hasMounted && isDark ? (
        <FiSun className="size-5" aria-hidden="true" />
      ) : (
        <FiMoon className="size-5" aria-hidden="true" />
      )}
    </InteractiveElement>
  );
};

export default ThemeToggle;
