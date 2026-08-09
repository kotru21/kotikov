"use client";

import { useResponsiveViewMode } from "@/features/device";

import { ProjectCardDeck } from "./ProjectCardDeck";
import { ProjectsGrid } from "./ProjectsGrid";

/**
 * Keeps CSS dual shells for layout, then mounts only the active breakpoint tree after
 * matchMedia sync (same pattern as Skills/Timeline: SSR dual-mounts; layout effect prunes).
 */
export function ProjectsViews(): React.JSX.Element {
  const mode = useResponsiveViewMode();
  const showMobile = mode === "both" || mode === "mobile";
  const showDesktop = mode === "both" || mode === "desktop";

  return (
    <>
      <div data-projects-view="mobile" className="md:hidden">
        {showMobile ? <ProjectCardDeck /> : null}
      </div>
      <div data-projects-view="desktop" className="hidden md:block">
        {showDesktop ? <ProjectsGrid /> : null}
      </div>
    </>
  );
}
