"use client";

import { ThemeToggle } from "@/features/theme/client";
import { useChromeVisibleState } from "@/widgets/shell/client";

interface PuzzleThemeToggleProps {
  className: string;
}

/** Theme control in the K cell; inert while chrome already exposes the same control. */
export function PuzzleThemeToggle({ className }: PuzzleThemeToggleProps): React.JSX.Element {
  const chromeVisible = useChromeVisibleState();
  return (
    <div className={chromeVisible ? "invisible" : undefined} inert={chromeVisible}>
      <ThemeToggle className={className} />
    </div>
  );
}
