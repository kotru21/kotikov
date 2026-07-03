"use client";

import React from "react";
import { FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

import type { ProjectItem } from "../model/types";
import ProjectCardPattern from "./ProjectCardPattern";

interface ProjectCardDetailsToggle {
  isExpanded: boolean;
  controlsId: string;
  onToggle: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

interface ProjectCardProps {
  project: ProjectItem;
  isStacked?: boolean;
  detailsToggle?: ProjectCardDetailsToggle;
  disableHover?: boolean;
  className?: string;
}

const pressButtonClassName =
  "focus-visible:ring-primary-400 inline-flex items-center gap-1.5 rounded-none border-2 border-black px-3 py-1.5 text-xs font-bold uppercase transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-2 focus-visible:outline-none dark:border-white dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";

function getShadowClass(isStacked: boolean, disableHover: boolean): string {
  if (isStacked) {
    return "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";
  }

  if (disableHover) {
    return "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]";
  }

  return "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-[transform,box-shadow] duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isStacked = false,
  detailsToggle,
  disableHover = false,
  className = "",
}) => {
  const CardIcon = project.cardIcon;
  const shadowClass = getShadowClass(isStacked, disableHover);

  return (
    <article
      className={`group relative flex min-h-[22rem] flex-col overflow-visible rounded-none border-2 border-black bg-white p-6 sm:min-h-[24rem] sm:p-7 dark:border-white dark:bg-neutral-900 ${shadowClass} ${className}`}
    >
      <ProjectCardPattern pattern={project.cardPattern} color={project.accentColor} />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-none border-2 border-black text-neutral-950 dark:border-white"
          style={{ backgroundColor: project.accentColor }}
        >
          <CardIcon className="size-6" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {project.cardPeriod}
        </p>
      </div>

      <div className="relative z-10 mt-auto pt-10">
        <p className="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">
          {project.eyebrow}
        </p>
        <h3 className="mt-2 text-2xl leading-tight font-bold text-neutral-950 sm:text-[1.75rem] dark:text-white">
          {project.title}
        </h3>
        <p className="mt-1 text-lg font-medium text-neutral-800 dark:text-white/85">
          {project.role}
        </p>
        <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {project.summary}
        </p>
      </div>

      <div className="relative z-10 mt-6 flex items-end justify-between gap-4">
        <p className="text-sm font-medium text-neutral-500">{project.cardMeta}</p>

        <div className="flex shrink-0 items-center gap-2">
          {detailsToggle ? (
            <button
              ref={detailsToggle.triggerRef}
              type="button"
              onClick={detailsToggle.onToggle}
              aria-expanded={detailsToggle.isExpanded}
              aria-controls={detailsToggle.controlsId}
              className={`${pressButtonClassName} min-h-11 min-w-11 cursor-pointer ${
                detailsToggle.isExpanded
                  ? "bg-neutral-100 text-neutral-900 dark:bg-black dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                  : "text-neutral-950 dark:text-neutral-950"
              }`}
              style={
                detailsToggle.isExpanded ? undefined : { backgroundColor: project.accentColor }
              }
            >
              {detailsToggle.isExpanded ? "Свернуть" : "Подробнее"}
            </button>
          ) : null}
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${pressButtonClassName} bg-neutral-100 text-neutral-900 dark:bg-black dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}
          >
            <FaGithub aria-hidden="true" /> Код
          </a>
          {project.liveUrl !== undefined ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${pressButtonClassName} text-neutral-950 dark:text-neutral-950`}
              style={{ backgroundColor: project.accentColor }}
            >
              <FiExternalLink aria-hidden="true" /> Live
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
