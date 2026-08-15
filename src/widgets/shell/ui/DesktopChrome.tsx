"use client";

import { ThemeToggle } from "@/features/theme/client";
import { type ChromeNavItem, chromeNavItems } from "@/shared/config/content";
import {
  CELL_HOVER,
  GRID_DIVIDE_X,
  GRID_STROKE,
  GRID_SURFACE,
  TEAL_FILL,
} from "@/shared/ui/gridChrome";
import { KMark } from "@/shared/ui/KMark";

import type { ActiveSectionId } from "../hooks/useActiveSection";
import { chromeSlideClass } from "../lib/chromeMotion";

const CELL_INTERACTION = `${CELL_HOVER} focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#111] dark:focus-visible:ring-[#ededed]`;

const STACKED_WORD =
  "min-w-0 w-full px-1 text-center text-[0.65rem] leading-tight font-black break-words whitespace-normal uppercase tracking-[-0.04em]";
const BAR_WORD =
  "px-1.5 text-center text-[clamp(1.35rem,17cqi,2.5rem)] leading-none font-black whitespace-nowrap uppercase tracking-[-0.05em]";

interface ChromeNavCellProps {
  item: ChromeNavItem;
  activeSection: ActiveSectionId;
  stacked?: boolean;
}

interface HomeCellProps {
  href: ChromeNavItem["href"];
  label: string;
  stacked?: boolean;
}

interface WordCellProps {
  item: ChromeNavItem;
  active: boolean;
  stacked?: boolean;
}

function HomeCell({ href, label, stacked = false }: HomeCellProps): React.JSX.Element {
  const layout = stacked ? "min-h-11 flex-col gap-2 p-2" : "flex-row gap-2";
  return (
    <div className={`${GRID_SURFACE} flex items-center justify-center ${layout}`}>
      <a
        aria-label={label}
        className={`flex min-h-11 min-w-11 shrink-0 touch-manipulation items-center justify-center text-[#111] dark:text-[#ededed] ${CELL_INTERACTION}`}
        href={href}
      >
        <KMark className="h-7 w-7" />
      </a>
      <ThemeToggle className={stacked ? "size-11" : "size-8"} />
    </div>
  );
}

function WordCell({ item, active, stacked = false }: WordCellProps): React.JSX.Element {
  const fill = active ? TEAL_FILL : GRID_SURFACE;
  const layout = stacked
    ? "min-h-11 min-w-0 w-full flex-col"
    : "@container min-h-11 min-w-0 w-full";
  return (
    <a
      aria-current={active ? "location" : undefined}
      className={`flex touch-manipulation items-center justify-center no-underline ${layout} ${stacked ? STACKED_WORD : ""} ${CELL_INTERACTION} ${fill}`}
      href={item.href}
    >
      {stacked ? item.label : <span className={BAR_WORD}>{item.label}</span>}
    </a>
  );
}

export function ChromeNavCell({
  item,
  activeSection,
  stacked = false,
}: ChromeNavCellProps): React.JSX.Element {
  if (item.kind === "home") {
    return <HomeCell href={item.href} label={item.label} stacked={stacked} />;
  }
  return <WordCell active={item.id === activeSection} item={item} stacked={stacked} />;
}

interface DesktopChromeProps {
  activeSection: ActiveSectionId;
  instant: boolean;
  open: boolean;
}

export function DesktopChrome({
  activeSection,
  instant,
  open,
}: DesktopChromeProps): React.JSX.Element {
  const events = open ? "pointer-events-auto" : "pointer-events-none";
  return (
    <nav
      aria-hidden={!open}
      aria-label="Основная навигация"
      className={`${GRID_SURFACE} fixed inset-x-0 bottom-0 z-50 hidden h-14 grid-cols-5 md:grid ${GRID_STROKE} ${GRID_DIVIDE_X} ${events} ${chromeSlideClass(open, "bottom", instant)}`}
      inert={!open}
    >
      {chromeNavItems.map((item) => (
        <ChromeNavCell key={item.id} activeSection={activeSection} item={item} />
      ))}
    </nav>
  );
}
