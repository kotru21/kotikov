"use client";

import React from "react";

import { useResponsiveViewMode } from "@/features/device/client";

import SkillsDesktopView from "./SkillsDesktopView";
import SkillsMobileView from "./SkillsMobileView";

/**
 * Keeps CSS dual shells for layout, then mounts only the active breakpoint tree after
 * matchMedia sync (S5-02: SSR dual-mounts; layout effect prunes before paint).
 */
const SkillsViews: React.FC = () => {
  const mode = useResponsiveViewMode();
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
