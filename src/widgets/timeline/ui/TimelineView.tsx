"use client";

import React, { useEffect, useMemo, useState } from "react";

import { timelineData as rawTimelineData } from "@/shared/config/content";
import { Section, SectionHeader } from "@/shared/ui";

import TimelineEditorialRail from "./TimelineEditorialRail";
import TimelineMobileView from "./TimelineMobileView";
import { sortTimelineItems } from "./timelineUtils";

type TimelineViewMode = "both" | "mobile" | "desktop";

/**
 * Keeps CSS dual shells for layout, then mounts only the active breakpoint tree after
 * matchMedia sync (S6-04: first paint still dual-mounts to avoid CLS/hydration skew).
 */
const TimelineView: React.FC = () => {
  const timelineData = useMemo(() => sortTimelineItems(rawTimelineData), []);
  const [mode, setMode] = useState<TimelineViewMode>("both");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const sync = (): void => {
      setMode(mediaQuery.matches ? "mobile" : "desktop");
    };

    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  const showMobile = mode === "both" || mode === "mobile";
  const showDesktop = mode === "both" || mode === "desktop";

  return (
    <Section
      id="experience"
      backgroundClassName="bg-background-primary dark:bg-background-tertiary"
      className="md:overflow-x-clip"
      innerClassName="relative z-10"
    >
      <SectionHeader
        eyebrow="Опыт"
        title="Мой путь"
        titleId="experience-heading"
        description="Образование и опыт работы"
      />

      <div data-timeline-view="mobile" className="md:hidden">
        {showMobile ? <TimelineMobileView items={timelineData} /> : null}
      </div>

      <div data-timeline-view="desktop" className="hidden md:block">
        {showDesktop ? <TimelineEditorialRail items={timelineData} /> : null}
      </div>
    </Section>
  );
};

export default TimelineView;
