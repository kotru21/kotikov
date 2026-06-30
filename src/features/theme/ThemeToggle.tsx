"use client";

import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";

import { InteractiveElement } from "@/features/interactive-elements";

import { useTheme } from "./useTheme";

const ThemeToggle: React.FC = () => {
  const { isDark, toggle } = useTheme();

  return (
    <InteractiveElement
      as="button"
      type="button"
      onClick={toggle}
      data-draw-exclude
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      aria-pressed={isDark}
      className="inline-flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-none border-2 border-black bg-white text-black transition-colors hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-700 dark:border-white dark:bg-black dark:text-white"
    >
      {isDark ? <FiSun className="size-5" aria-hidden="true" /> : <FiMoon className="size-5" aria-hidden="true" />}
    </InteractiveElement>
  );
};

export default ThemeToggle;
