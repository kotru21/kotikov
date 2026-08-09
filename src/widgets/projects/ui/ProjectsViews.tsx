"use client";

import { useEffect, useState } from "react";

import { ProjectCardDeck } from "./ProjectCardDeck";
import { ProjectsGrid } from "./ProjectsGrid";

type ProjectsViewMode = "both" | "mobile" | "desktop";

/**
 * Keeps CSS dual shells for layout, then mounts only the active breakpoint tree after
 * matchMedia sync (same pattern as Skills/Timeline: first paint dual-mounts to avoid CLS).
 */
export function ProjectsViews(): React.JSX.Element {
  const [mode, setMode] = useState<ProjectsViewMode>("both");

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

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
    <>
      <div data-projects-view="mobile" className="md:hidden">
        {showMobile ? <ProjectCardDeck /> : null}
      </div>
      <div data-projects-view="desktop">
        {showDesktop ? <ProjectsGrid /> : null}
      </div>
    </>
  );
}
