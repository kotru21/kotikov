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

const BAR_WORD =
  "px-1.5 text-center text-[clamp(1.35rem,17cqi,2.5rem)] leading-none font-black whitespace-nowrap uppercase tracking-[-0.05em]";
const COMPACT_WORD =
  "px-0.5 text-center text-[clamp(0.62rem,12cqi,0.8rem)] leading-tight font-black whitespace-normal uppercase tracking-[-0.04em]";

interface ChromeNavCellProps {
  item: ChromeNavItem;
  activeSection: ActiveSectionId;
  compact?: boolean;
}

interface HomeCellProps {
  href: ChromeNavItem["href"];
  label: string;
  compact?: boolean;
}

interface WordCellProps {
  item: ChromeNavItem;
  active: boolean;
  compact?: boolean;
}

function HomeCell({ href, label, compact = false }: HomeCellProps): React.JSX.Element {
  return (
    <div className={`${GRID_SURFACE} flex items-center justify-center ${compact ? "" : "gap-2"}`}>
      <a
        aria-label={label}
        className={`flex min-h-11 min-w-11 shrink-0 touch-manipulation items-center justify-center text-[#111] dark:text-[#ededed] ${CELL_INTERACTION}`}
        href={href}
      >
        <KMark className="h-7 w-7" />
      </a>
      {compact ? null : <ThemeToggle className="size-8" />}
    </div>
  );
}

function WordCell({ item, active, compact = false }: WordCellProps): React.JSX.Element {
  const fill = active ? TEAL_FILL : GRID_SURFACE;
  return (
    <a
      aria-current={active ? "location" : undefined}
      className={`@container flex min-h-11 min-w-0 w-full touch-manipulation items-center justify-center no-underline ${CELL_INTERACTION} ${fill}`}
      href={item.href}
    >
      <span className={compact ? COMPACT_WORD : BAR_WORD}>{item.label}</span>
    </a>
  );
}

export function ChromeNavCell({
  item,
  activeSection,
  compact = false,
}: ChromeNavCellProps): React.JSX.Element {
  if (item.kind === "home") {
    return <HomeCell compact={compact} href={item.href} label={item.label} />;
  }
  return <WordCell active={item.id === activeSection} compact={compact} item={item} />;
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
      data-chrome="desktop"
      inert={!open}
    >
      {chromeNavItems.map((item) => (
        <ChromeNavCell key={item.id} activeSection={activeSection} item={item} />
      ))}
    </nav>
  );
}
