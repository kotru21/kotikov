"use client";

import { useResponsiveViewMode } from "@/features/device/client";

import { PuzzleDesktop } from "./PuzzleDesktop";

interface PuzzleViewsProps {
  mobile: React.ReactNode;
}

/**
 * SSR dual-mounts both breakpoints; layout effect prunes the inactive tree.
 * Mobile markup is an RSC slot so tickers/cells stay server-rendered.
 */
export function PuzzleViews({ mobile }: PuzzleViewsProps): React.JSX.Element {
  const mode = useResponsiveViewMode();
  const showMobile = mode === "both" || mode === "mobile";
  const showDesktop = mode === "both" || mode === "desktop";

  return (
    <>
      {showMobile ? <div className="md:hidden">{mobile}</div> : null}
      {showDesktop ? <PuzzleDesktop /> : null}
    </>
  );
}
