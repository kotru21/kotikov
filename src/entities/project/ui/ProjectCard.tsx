import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import React from "react";
import { FaGithub } from "react-icons/fa";

import { formatExternalLinkLabel } from "@/shared/lib";

import type { ProjectItem } from "../model/types";
import ProjectCardPattern from "./ProjectCardPattern";

interface ProjectCardProps {
  project: ProjectItem;
  isStacked?: boolean;
  className?: string;
  /** Below xl: short horizontal row; from xl: tall vertical card. */
  wideOnTablet?: boolean;
}

const pressButtonClassName =
  "focus-visible:ring-primary-400 inline-flex items-center gap-1.5 rounded-none border-2 border-black px-3 py-1.5 text-xs font-bold uppercase transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-2 focus-visible:outline-none dark:border-white dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";

function getShadowClass(isStacked: boolean): string {
  if (isStacked) {
    return "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";
  }

  return "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-[transform,box-shadow] duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isStacked = false,
  className = "",
  wideOnTablet = false,
}) => {
  const CardIcon = project.cardIcon;
  const shadowClass = getShadowClass(isStacked);

  return (
    <article
      className={`group relative flex overflow-visible rounded-none border-2 border-black bg-white dark:border-white dark:bg-neutral-900 ${shadowClass} ${
        wideOnTablet
          ? "min-h-56 flex-row items-stretch gap-6 p-5 sm:min-h-60 sm:p-6 xl:min-h-96 xl:flex-col xl:gap-0 xl:p-6 sm:xl:p-7"
          : "min-h-88 flex-col p-6 sm:min-h-96 sm:p-7"
      } ${className}`}
    >
      <ProjectCardPattern pattern={project.cardPattern} color={project.accentColor} />

      <div
        className={`relative z-10 flex shrink-0 items-start justify-between gap-4 ${
          wideOnTablet ? "flex-col xl:flex-row" : ""
        }`}
      >
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

      <div
        className={`relative z-10 flex min-w-0 flex-1 flex-col ${
          wideOnTablet
            ? "justify-center pt-0 xl:mt-auto xl:justify-start xl:pt-10"
            : "mt-auto pt-10"
        }`}
      >
        <p className="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">
          {project.eyebrow}
        </p>
        <h3
          className={`mt-2 font-bold text-neutral-950 dark:text-white ${
            wideOnTablet
              ? "text-xl leading-tight sm:text-2xl xl:text-[1.75rem]"
              : "text-2xl leading-tight sm:text-[1.75rem]"
          }`}
        >
          {project.title}
        </h3>
        <p className="mt-1 text-lg font-medium text-neutral-800 dark:text-white/85">
          {project.role}
        </p>
        <p
          className={`max-w-[70ch] leading-relaxed text-neutral-600 dark:text-neutral-400 ${
            wideOnTablet ? "mt-3 text-sm sm:text-base xl:mt-4 xl:text-base" : "mt-4 text-base"
          }`}
        >
          {project.summary}
        </p>
      </div>

      <div
        className={`relative z-10 flex shrink-0 gap-4 ${
          wideOnTablet
            ? "flex-col items-end justify-between self-stretch xl:mt-6 xl:flex-row xl:items-end xl:justify-between"
            : "mt-6 items-end justify-between"
        }`}
      >
        <p className="text-sm font-medium text-neutral-500">{project.cardMeta}</p>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={formatExternalLinkLabel("Код")}
            className={`${pressButtonClassName} bg-neutral-100 text-neutral-900 dark:bg-black dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}
          >
            <FaGithub aria-hidden="true" /> Код
          </a>
          {project.liveUrl !== undefined ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={formatExternalLinkLabel("Демо")}
              className={`${pressButtonClassName} text-neutral-950 dark:text-neutral-950`}
              style={{ backgroundColor: project.accentColor }}
            >
              <ArrowTopRightOnSquareIcon className="size-3.5" aria-hidden="true" /> Демо
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
