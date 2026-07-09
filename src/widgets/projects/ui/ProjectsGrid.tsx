"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";

import { ProjectCardExpandable } from "@/entities/project";
import { usePerformanceSettings } from "@/features/performance";
import { projectsData } from "@/shared/config/content";

const DESKTOP_XL_MEDIA = "(min-width: 1280px)";

function getColumnCount(viewportWidth: number): number {
  return viewportWidth >= 1280 ? 3 : 2;
}

const ProjectsGrid: React.FC = () => {
  const { reducedMotion } = usePerformanceSettings();
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const expandedIndex = useMemo(() => {
    if (expandedSlug === null) {
      return null;
    }

    const index = projectsData.findIndex((project) => project.slug === expandedSlug);
    return index === -1 ? null : index;
  }, [expandedSlug]);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) {
      return;
    }

    const syncCardWidth = (): void => {
      if (anchor.clientWidth <= 0) {
        return;
      }

      const styles = getComputedStyle(anchor);
      const gapValue = styles.getPropertyValue("--project-gap").trim();
      const gap = gapValue.endsWith("rem")
        ? Number.parseFloat(gapValue) * Number.parseFloat(styles.fontSize)
        : Number.parseFloat(gapValue);
      const columns = getColumnCount(window.innerWidth);
      const cardWidth = (anchor.clientWidth - gap * (columns - 1)) / columns;

      if (cardWidth <= 0) {
        return;
      }

      anchor.style.setProperty("--project-card-w", `${String(cardWidth)}px`);
    };

    syncCardWidth();

    const mediaQuery = window.matchMedia(DESKTOP_XL_MEDIA);
    mediaQuery.addEventListener("change", syncCardWidth);
    window.addEventListener("resize", syncCardWidth);

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(syncCardWidth) : null;
    observer?.observe(anchor);

    return () => {
      observer?.disconnect();
      mediaQuery.removeEventListener("change", syncCardWidth);
      window.removeEventListener("resize", syncCardWidth);
    };
  }, []);

  return (
    <div ref={anchorRef} className="projects-grid-anchor hidden md:block">
      <div
        className="projects-grid-shell"
        data-expanded={expandedIndex ?? "none"}
        data-reduced-motion={reducedMotion ? "true" : "false"}
      >
        <div className="projects-grid auto-rows-min">
          {projectsData.map((project) => (
            <ProjectCardExpandable
              key={project.slug}
              project={project}
              layout="desktop"
              isExpanded={expandedSlug === project.slug}
              onExpandedChange={setExpandedSlug}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsGrid;
