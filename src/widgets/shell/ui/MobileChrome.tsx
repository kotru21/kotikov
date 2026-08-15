"use client";

import { chromeNavItems, sectionTitles } from "@/shared/config/content";
import { GRID_DIVIDE, GRID_STROKE, GRID_SURFACE } from "@/shared/ui/gridChrome";

import type { ActiveSectionId } from "../hooks/useActiveSection";
import { chromeSlideClass } from "../lib/chromeMotion";
import { ChromeNavCell } from "./DesktopChrome";

const SPINE_TYPE = "font-black uppercase tracking-[0.24em] text-[clamp(1.5rem,4vw,2.75rem)]";

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

function spineBarClass(open: boolean, instant: boolean): string {
  return `${GRID_SURFACE} ${pointerEvents(open)} fixed top-0 left-0 flex h-full w-10 items-center justify-center overflow-hidden ${GRID_STROKE} ${chromeSlideClass(open, "left", instant)}`;
}

function railClass(open: boolean, instant: boolean): string {
  return `${GRID_SURFACE} ${pointerEvents(open)} fixed top-0 right-0 grid h-full w-20 touch-manipulation grid-rows-5 ${GRID_STROKE} ${GRID_DIVIDE} ${chromeSlideClass(open, "right", instant)}`;
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
      <div className={spineBarClass(open, instant)}>
        {title !== null ? (
          <p
            aria-hidden="true"
            data-chrome-spine
            className={`${SPINE_TYPE} rotate-180 overflow-hidden whitespace-nowrap [writing-mode:vertical-rl]`}
          >
            {title}
          </p>
        ) : null}
      </div>
      <nav aria-label="Основная навигация" className={railClass(open, instant)}>
        {chromeNavItems.map((item) => (
          <ChromeNavCell key={item.id} activeSection={activeSection} item={item} stacked />
        ))}
      </nav>
    </div>
  );
}
