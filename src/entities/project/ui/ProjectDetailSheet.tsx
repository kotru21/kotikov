"use client";

import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

import type { ProjectItem } from "../model/types";
import ProjectCardDetailGrid from "./ProjectCardDetailGrid";

interface ProjectDetailSheetProps {
  project: ProjectItem;
  isOpen: boolean;
  onClose: () => void;
  reducedMotion?: boolean;
}

const ProjectDetailSheet: React.FC<ProjectDetailSheetProps> = ({
  project,
  isOpen,
  onClose,
  reducedMotion = false,
}) => {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const detailsId = `project-sheet-details-${project.slug}`;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const overlayMotion = reducedMotion ? "" : "transition-opacity duration-350 ease-out";
  const sheetMotion = reducedMotion
    ? "translate-y-0"
    : "transition-transform duration-400 ease-out translate-y-0";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end">
      <button
        type="button"
        aria-label="Закрыть подробности проекта"
        data-testid="project-detail-overlay"
        className={`absolute inset-0 cursor-pointer bg-black/85 ${overlayMotion}`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-none border-2 border-black bg-white shadow-[4px_4px_0px_0px_#00ffb9] dark:border-white dark:bg-neutral-900 ${sheetMotion}`}
      >
        <div className="flex items-center justify-between border-b-2 border-black bg-black px-4 py-3 dark:border-white">
          <h2 id={titleId} className="text-sm font-bold tracking-[0.08em] text-white uppercase">
            {project.title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Закрыть подробности проекта"
            onClick={onClose}
            className="focus-visible:ring-primary-400 inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-none border-2 border-white text-white transition-colors duration-200 hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:outline-none"
          >
            <FiX className="size-5" aria-hidden="true" />
          </button>
        </div>

        <ProjectCardDetailGrid
          project={project}
          id={detailsId}
          isVisible
          reducedMotion={reducedMotion}
        />
      </div>
    </div>,
    document.body,
  );
};

export default ProjectDetailSheet;
export { ProjectDetailSheet };
