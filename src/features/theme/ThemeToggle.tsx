"use client";

import { FiMoon, FiSun } from "react-icons/fi";

// Intentional feature→feature use: InteractiveElement owns paint-collision /
// data-draw-exclude behavior shared with header chrome. Do not swap for a
// plain button without preserving paint exclusion (Stage 9 if extracting shared).
import { InteractiveElement } from "@/features/interactive-elements";

import { useHasMounted, useTheme } from "./ThemeProvider";

export function ThemeToggle(): React.JSX.Element {
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
}
