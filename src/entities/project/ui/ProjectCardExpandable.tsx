"use client";

import React, { useId, useRef, useState } from "react";

import { usePerformanceSettings } from "@/features/performance";

import type { ProjectItem } from "../model/types";
import ProjectCard from "./ProjectCard";
import ProjectCardDetailGrid from "./ProjectCardDetailGrid";
import ProjectDetailSheet from "./ProjectDetailSheet";

interface ProjectCardExpandableProps {
  project: ProjectItem;
  layout: "desktop" | "mobile";
  isExpanded: boolean;
  onExpandedChange: (slug: string | null) => void;
  isStacked?: boolean;
}

const ProjectCardExpandable: React.FC<ProjectCardExpandableProps> = ({
  project,
  layout,
  isExpanded,
  onExpandedChange,
  isStacked = false,
}) => {
  const { reducedMotion } = usePerformanceSettings();
  const detailsId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleToggle = (): void => {
    if (layout === "mobile") {
      setIsSheetOpen((open) => !open);
      return;
    }

    onExpandedChange(isExpanded ? null : project.slug);
  };

  const handleSheetClose = (): void => {
    setIsSheetOpen(false);
    toggleRef.current?.focus();
  };

  const showInlineDetails = layout === "desktop" && isExpanded;

  return (
    <>
      <div className={`flex flex-col ${showInlineDetails ? "row-span-2" : ""}`}>
        <ProjectCard
          project={project}
          isStacked={isStacked}
          disableHover={showInlineDetails}
          detailsToggle={{
            isExpanded: layout === "desktop" ? isExpanded : isSheetOpen,
            controlsId: detailsId,
            onToggle: handleToggle,
          }}
        />
        {layout === "desktop" ? (
          <ProjectCardDetailGrid
            project={project}
            id={detailsId}
            isVisible={showInlineDetails}
            reducedMotion={reducedMotion}
          />
        ) : null}
      </div>

      {layout === "mobile" ? (
        <ProjectDetailSheet
          project={project}
          isOpen={isSheetOpen}
          onClose={handleSheetClose}
          reducedMotion={reducedMotion}
        />
      ) : null}
    </>
  );
};

export default ProjectCardExpandable;
export { ProjectCardExpandable };
