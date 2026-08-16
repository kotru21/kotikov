"use client";

import { FiMoon, FiSun } from "react-icons/fi";

// Intentional feature→feature use: InteractiveElement owns paint-collision /
// data-draw-exclude behavior shared with site chrome. Do not swap for a
// plain button without preserving paint exclusion (Stage 9 if extracting shared).
import { InteractiveElement } from "@/features/interactive-elements/client";

import { useTheme } from "./ThemeProvider";

const TOGGLE_BASE =
  "hover:bg-primary-500 inline-flex hover:text-[#111] focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:outline-none dark:hover:text-[#111] dark:focus-visible:ring-[#ededed] shrink-0 touch-manipulation items-center justify-center rounded-none transition-colors";
const TOGGLE_FRAMED =
  "border-2 border-black bg-white text-black focus-visible:ring-offset-2 dark:border-[#ededed] dark:bg-[#0a0a0a] dark:text-[#ededed]";
const TOGGLE_CELL = "border-0 focus-visible:ring-inset";

interface ThemeToggleProps {
  className?: string;
  /** Standalone 2px frame. Chrome cells pass false — parent divide/stroke is the rule. */
  framed?: boolean;
}

function toggleClassName(className: string | undefined, framed: boolean): string {
  const sizeClass = className ?? "size-11";
  const stroke = framed ? TOGGLE_FRAMED : TOGGLE_CELL;
  return `${TOGGLE_BASE} ${stroke} ${sizeClass}`;
}

export function ThemeToggle({
  className,
  framed = true,
}: ThemeToggleProps): React.JSX.Element {
  "use no memo";

  const { isDark, toggle } = useTheme();
  const ariaLabel = isDark ? "Включить светлую тему" : "Включить тёмную тему";

  return (
    <InteractiveElement
      as="button"
      type="button"
      onClick={toggle}
      data-draw-exclude
      aria-label={ariaLabel}
      aria-pressed={isDark}
      className={toggleClassName(className, framed)}
    >
      {/* Follow html.dark from the blocking init script so the icon is correct before React hydrates. */}
      <FiSun className="hidden size-5 dark:block" aria-hidden="true" />
      <FiMoon className="block size-5 dark:hidden" aria-hidden="true" />
    </InteractiveElement>
  );
}
