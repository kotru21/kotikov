"use client";

import React, { useMemo } from "react";

import { useResponsiveViewMode } from "@/features/device/client";
import { timelineData as rawTimelineData } from "@/shared/config/content";

import TimelineEditorialRail from "./TimelineEditorialRail";
import TimelineMobileView from "./TimelineMobileView";
import { sortTimelineItems } from "./timelineUtils";

/**
 * Client island for timeline trees. Section chrome lives in TimelineWidget (RSC).
 * SSR dual-mounts; layout effect prunes to the active breakpoint before paint.
 */
const TimelineView: React.FC = () => {
  const timelineData = useMemo(() => sortTimelineItems(rawTimelineData), []);
  const mode = useResponsiveViewMode();
  const showMobile = mode === "both" || mode === "mobile";
  const showDesktop = mode === "both" || mode === "desktop";

  return (
    <>
      <div data-timeline-view="mobile" className="md:hidden">
        {showMobile ? <TimelineMobileView items={timelineData} /> : null}
      </div>

      <div data-timeline-view="desktop" className="hidden md:block">
        {showDesktop ? <TimelineEditorialRail items={timelineData} /> : null}
      </div>
    </>
  );
};

export default TimelineView;
