"use client";

import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";

import { InteractiveElement } from "@/features/interactive-elements";
import { colors } from "@/styles/colors";

import { useTheme } from "./useTheme";

const ThemeToggle: React.FC = () => {
  const { isDark, toggle } = useTheme();

  return (
    <InteractiveElement
      as="button"
      type="button"
      onClick={toggle}
      data-draw-allow
      data-interactive-mode="solid"
      data-interactive-bg={colors.primary[500]}
      data-interactive-text="black"
      data-interactive-threshold="0.12"
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      aria-pressed={isDark}
      className="inline-flex h-9 w-9 items-center justify-center rounded-none border-2 border-black bg-white text-black transition-colors hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-700 dark:border-white dark:bg-black dark:text-white"
    >
      {isDark ? <FiSun className="size-5" aria-hidden="true" /> : <FiMoon className="size-5" aria-hidden="true" />}
    </InteractiveElement>
  );
};

export default ThemeToggle;
