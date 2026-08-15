"use client";

import { ThemeToggle } from "@/features/theme/client";
import { chromeNavItems, sectionTitles } from "@/shared/config/content";
import { GRID_DIVIDE_X, GRID_STROKE, GRID_SURFACE } from "@/shared/ui/gridChrome";

import type { ActiveSectionId } from "../hooks/useActiveSection";
import { chromeSlideClass } from "../lib/chromeMotion";
import { ChromeNavCell } from "./DesktopChrome";

const TITLE_TYPE =
  "min-w-0 flex-1 truncate px-3 text-left font-black uppercase tracking-[-0.05em] text-[clamp(1rem,5vw,1.5rem)]";

interface MobileChromeProps {
  activeSection: ActiveSectionId;
  instant: boolean;
  open: boolean;
}

function spineTitle(activeSection: ActiveSectionId): string | null {
  if (activeSection === null) {
    return null;
  }
  return sectionTitles[activeSection];
}

function pointerEvents(open: boolean): string {
  return open ? "pointer-events-auto" : "pointer-events-none";
}

function titleBarClass(open: boolean, instant: boolean): string {
  return `${GRID_SURFACE} ${pointerEvents(open)} fixed inset-x-0 top-0 pt-[env(safe-area-inset-top,0px)] ${chromeSlideClass(open, "top", instant)}`;
}

function barWrapClass(open: boolean, instant: boolean): string {
  return `${GRID_SURFACE} ${pointerEvents(open)} fixed inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom,0px)] ${chromeSlideClass(open, "bottom", instant)}`;
}

export function MobileChrome({
  activeSection,
  instant,
  open,
}: MobileChromeProps): React.JSX.Element {
  const title = spineTitle(activeSection);
  return (
    <div
      aria-hidden={!open}
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden md:hidden"
      inert={!open}
    >
      <div className={titleBarClass(open, instant)}>
        <div
          className={`flex h-12 items-stretch ${GRID_STROKE} ${GRID_DIVIDE_X}`}
          data-chrome="title"
        >
          {title !== null ? (
            <p aria-hidden="true" className={TITLE_TYPE} data-chrome-spine>
              {title}
            </p>
          ) : (
            <span className="flex-1" />
          )}
          <div className="flex w-12 shrink-0 items-center justify-center">
            <ThemeToggle className="size-11" />
          </div>
        </div>
      </div>
      <div className={barWrapClass(open, instant)}>
        <nav
          aria-label="Основная навигация"
          className={`grid h-14 grid-cols-5 touch-manipulation ${GRID_STROKE} ${GRID_DIVIDE_X}`}
          data-chrome="mobile"
        >
          {chromeNavItems.map((item) => (
            <ChromeNavCell
              key={item.id}
              activeSection={activeSection}
              compact
              item={item}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}
