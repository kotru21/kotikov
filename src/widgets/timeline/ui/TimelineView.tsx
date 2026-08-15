"use client";

import { useMemo } from "react";

import { useResponsiveViewMode } from "@/features/device/client";
import { timelineData as rawTimelineData } from "@/shared/config/content";

import { TimelineDesktop } from "./TimelineDesktop";
import { TimelineMobile } from "./TimelineMobile";
import { sortTimelineItems } from "./timelineUtils";

/**
 * Client island for the experience carousel. Section chrome lives in TimelineWidget (RSC).
 * SSR dual-mounts; layout effect prunes to the active breakpoint before paint.
 */
export default function TimelineView(): React.JSX.Element {
  const items = useMemo(() => sortTimelineItems(rawTimelineData), []);
  const mode = useResponsiveViewMode();
  const showMobile = mode === "both" || mode === "mobile";
  const showDesktop = mode === "both" || mode === "desktop";

  return (
    <>
      {showMobile ? (
        <div className="md:hidden">
          <TimelineMobile items={items} />
        </div>
      ) : null}
      {showDesktop ? (
        <div className="hidden md:block">
          <TimelineDesktop items={items} />
        </div>
      ) : null}
    </>
  );
}
