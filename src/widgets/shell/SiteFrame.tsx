"use client";

import { memo, useRef } from "react";

import { usePerformanceSettings } from "@/features/performance/client";

import { useActiveSection } from "./hooks/useActiveSection";
import { ChromeVisibleProvider, useChromeVisible } from "./hooks/useChromeVisible";
import { DesktopChrome } from "./ui/DesktopChrome";
import { MobileChrome } from "./ui/MobileChrome";

const SECTION_IDS = ["about", "projects", "skills", "experience", "contacts"] as const;

/** Mobile rail inset. Desktop chrome clearance is `md:pb-14` on this wrapper — never on `main > *`, which painted a 3.5rem hole inside bordered bands. Hash jumps already use `html { scroll-padding-bottom: var(--chrome-bar-offset) }`. */
const CONTENT_OFFSET = "max-md:pl-10 max-md:pr-20 md:pb-14";

interface SiteFrameProps {
  puzzle: React.ReactNode;
  children: React.ReactNode;
}

const PuzzleSlotInner = ({
  puzzleRef,
  children,
}: {
  puzzleRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}): React.JSX.Element => {
  return <div ref={puzzleRef}>{children}</div>;
};

const PuzzleSlot = memo(PuzzleSlotInner);

function ChromeIsland({ open }: { open: boolean }): React.JSX.Element {
  const activeSection = useActiveSection(SECTION_IDS);
  const { reducedMotion, lowPerformance } = usePerformanceSettings();
  const instant = reducedMotion || lowPerformance;

  return (
    <>
      <DesktopChrome activeSection={activeSection} instant={instant} open={open} />
      <MobileChrome activeSection={activeSection} instant={instant} open={open} />
    </>
  );
}

export function SiteFrame({ puzzle, children }: SiteFrameProps): React.JSX.Element {
  const puzzleRef = useRef<HTMLDivElement>(null);
  const chromeVisible = useChromeVisible(puzzleRef);

  return (
    <ChromeVisibleProvider open={chromeVisible}>
      <PuzzleSlot puzzleRef={puzzleRef}>{puzzle}</PuzzleSlot>
      <ChromeIsland open={chromeVisible} />
      <div className={CONTENT_OFFSET}>{children}</div>
    </ChromeVisibleProvider>
  );
}
