"use client";

import React, { useId, useRef, useState } from "react";

import type { ProjectItem } from "../model/types";
import ProjectCard from "./ProjectCard";
import ProjectCardDetailGrid from "./ProjectCardDetailGrid";
import ProjectDetailSheet from "./ProjectDetailSheet";

interface ProjectCardExpandableProps {
  project: ProjectItem;
  layout: "desktop" | "mobile";
  isExpanded: boolean;
  onExpandedChange?: (slug: string | null) => void;
  isStacked?: boolean;
  reducedMotion?: boolean;
}

const ProjectCardExpandable: React.FC<ProjectCardExpandableProps> = ({
  project,
  layout,
  isExpanded,
  onExpandedChange,
  isStacked = false,
  reducedMotion = false,
}) => {
  const detailsId = useId();
  const detailsToggleRef = useRef<HTMLButtonElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleToggle = (): void => {
    if (layout === "mobile") {
      setIsSheetOpen((open) => !open);
      return;
    }

    onExpandedChange?.(isExpanded ? null : project.slug);
  };

  const handleSheetClose = (): void => {
    setIsSheetOpen(false);
  };

  const showInlineDetails = layout === "desktop" && isExpanded;
  const innerGridTransition = reducedMotion
    ? ""
    : "transition-[grid-template-columns] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <>
      {layout === "desktop" ? (
        <div
          className={`grid min-w-0 overflow-visible ${innerGridTransition} ${
            showInlineDetails ? "items-stretch" : ""
          } ${
            showInlineDetails
              ? "border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-neutral-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
              : ""
          }`}
          style={{
            gridTemplateColumns: showInlineDetails
              ? "var(--project-card-w) var(--project-detail-w)"
              : "minmax(0, 1fr) minmax(0, 0fr)",
          }}
        >
          <div className={showInlineDetails ? "h-full min-w-0 shrink-0" : "min-w-0"}>
            <ProjectCard
              project={project}
              isStacked={isStacked}
              disableHover={showInlineDetails}
              className={
                showInlineDetails
                  ? "h-full min-h-[22rem] !border-0 !shadow-none sm:min-h-[24rem]"
                  : ""
              }
              detailsToggle={{
                isExpanded,
                controlsId: detailsId,
                onToggle: handleToggle,
              }}
            />
          </div>

          <ProjectCardDetailGrid
            project={project}
            id={detailsId}
            isVisible={showInlineDetails}
            reducedMotion={reducedMotion}
            orientation="horizontal"
          />
        </div>
      ) : (
        <ProjectCard
          project={project}
          isStacked={isStacked}
          detailsToggle={{
            isExpanded: isSheetOpen,
            controlsId: detailsId,
            onToggle: handleToggle,
            triggerRef: detailsToggleRef,
          }}
        />
      )}

      {layout === "mobile" ? (
        <ProjectDetailSheet
          project={project}
          isOpen={isSheetOpen}
          onClose={handleSheetClose}
          reducedMotion={reducedMotion}
          returnFocusRef={detailsToggleRef}
        />
      ) : null}
    </>
  );
};

export default ProjectCardExpandable;
export { ProjectCardExpandable };
