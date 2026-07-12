"use client";

import React, { useEffect, useState } from "react";

import SkillsDesktopView from "./SkillsDesktopView";
import SkillsMobileView from "./SkillsMobileView";

type SkillsViewMode = "both" | "mobile" | "desktop";

/**
 * Keeps CSS dual shells for layout, then mounts only the active breakpoint tree after
 * matchMedia sync (S5-02 partial: first paint still dual-mounts to avoid CLS/hydration skew).
 */
const SkillsViews: React.FC = () => {
  const [mode, setMode] = useState<SkillsViewMode>("both");

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
    <>
      <div data-skills-view="mobile" className="md:hidden">
        {showMobile ? <SkillsMobileView headingId="skills-heading-mobile" /> : null}
      </div>
      <div data-skills-view="desktop" className="hidden md:block">
        {showDesktop ? <SkillsDesktopView headingId="skills-heading-desktop" /> : null}
      </div>
    </>
  );
};

export default SkillsViews;
