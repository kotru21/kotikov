"use client";

import { useResponsiveViewMode } from "@/features/device/client";

import { ProjectCardDeck } from "./ProjectCardDeck";

/** Client island for the mobile project slider. Desktop grid stays RSC. */
export function ProjectsMobileDeck(): React.JSX.Element | null {
  const mode = useResponsiveViewMode();
  const showMobile = mode === "both" || mode === "mobile";
  if (!showMobile) {
    return null;
  }

  return (
    <div className="md:hidden" data-projects-view="mobile">
      <ProjectCardDeck />
    </div>
  );
}
