"use client";

import { FiMoon, FiSun } from "react-icons/fi";

// Intentional feature→feature use: InteractiveElement owns paint-collision /
// data-draw-exclude behavior shared with header chrome. Do not swap for a
// plain button without preserving paint exclusion (Stage 9 if extracting shared).
import { InteractiveElement } from "@/features/interactive-elements/client";

import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps): React.JSX.Element {
  "use no memo";

  const { isDark, toggle } = useTheme();
  const ariaLabel = isDark ? "Включить светлую тему" : "Включить тёмную тему";
  const sizeClass = className ?? "size-11";

  return (
    <InteractiveElement
      as="button"
      type="button"
      onClick={toggle}
      data-draw-exclude
      aria-label={ariaLabel}
      aria-pressed={isDark}
      className={`hover:bg-primary-500 inline-flex hover:text-[#111] focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-2 focus-visible:outline-none dark:border-[#ededed] dark:bg-[#0a0a0a] dark:text-[#ededed] dark:hover:text-[#111] dark:focus-visible:ring-[#ededed] ${sizeClass} shrink-0 touch-manipulation items-center justify-center rounded-none border-2 border-black bg-white text-black transition-colors`}
    >
      {/* Follow html.dark from the blocking init script so the icon is correct before React hydrates. */}
      <FiSun className="hidden size-5 dark:block" aria-hidden="true" />
      <FiMoon className="block size-5 dark:hidden" aria-hidden="true" />
    </InteractiveElement>
  );
}
