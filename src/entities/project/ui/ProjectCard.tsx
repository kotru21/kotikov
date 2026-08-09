import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { FaGithub } from "react-icons/fa";

import { formatExternalLinkLabel, isSafeHref } from "@/shared/lib";

import type { ProjectItem } from "../model/types";
import { ProjectCardPattern } from "./ProjectCardPattern";

interface ProjectCardProps {
  project: ProjectItem;
  /**
   * Widget layout mode: inactive deck stack uses a lighter shadow.
   * Kept on the entity so `ProjectCardDeck` can match current visuals without class drift.
   */
  isStacked?: boolean;
  className?: string;
  /**
   * Full-width featured banner in `ProjectsGrid` (always horizontal).
   */
  featured?: boolean;
  /**
   * Widget layout mode: orphan grid card is short/horizontal below xl.
   * Owned by `ProjectsGrid`; prop stays here to preserve identical class output.
   */
  wideOnTablet?: boolean;
}

type CardLayout = "default" | "wideOnTablet" | "featured";

const pressButtonClassName =
  "focus-visible:ring-primary-400 inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-none border-2 border-black px-4 text-xs font-bold uppercase transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-2 focus-visible:outline-none dark:border-white dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";

function resolveCardLayout(featured: boolean, wideOnTablet: boolean): CardLayout {
  if (featured) return "featured";
  if (wideOnTablet) return "wideOnTablet";
  return "default";
}

function getShadowClass(isStacked: boolean): string {
  if (isStacked) {
    return "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";
  }

  return "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-[transform,box-shadow] duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";
}

function getArticleLayoutClass(layout: CardLayout): string {
  if (layout === "featured") {
    return "min-h-56 flex-row items-stretch gap-6 p-5 sm:min-h-60 sm:gap-8 sm:p-6 lg:min-h-64 lg:p-7";
  }

  if (layout === "wideOnTablet") {
    return "min-h-56 flex-row items-stretch gap-6 p-5 sm:min-h-60 sm:p-6 xl:min-h-96 xl:flex-col xl:gap-0 xl:p-6 sm:xl:p-7";
  }

  return "min-h-88 flex-col p-6 sm:min-h-96 sm:p-7";
}

function getHeaderLayoutClass(layout: CardLayout): string {
  if (layout === "wideOnTablet") return "flex-col xl:flex-row";
  if (layout === "featured") return "flex-col";
  return "";
}

function getBodyLayoutClass(layout: CardLayout): string {
  if (layout === "featured") return "justify-center pt-0";
  if (layout === "wideOnTablet") {
    return "justify-center pt-0 xl:mt-auto xl:justify-start xl:pt-10";
  }
  return "mt-auto pt-10";
}

function getTitleClass(isBanner: boolean): string {
  if (isBanner) return "text-xl leading-tight sm:text-2xl xl:text-[1.75rem]";
  return "text-2xl leading-tight sm:text-[1.75rem]";
}

function getSummaryClass(layout: CardLayout): string {
  if (layout === "featured") return "mt-3 text-sm sm:mt-4 sm:text-base";
  if (layout === "wideOnTablet") return "mt-3 text-sm sm:text-base xl:mt-4 xl:text-base";
  return "mt-4 text-base";
}

function getFooterLayoutClass(layout: CardLayout): string {
  if (layout === "featured") return "flex-col items-end justify-between self-stretch";
  if (layout === "wideOnTablet") {
    return "flex-col items-end justify-between self-stretch xl:mt-6 xl:flex-row xl:items-end xl:justify-between";
  }
  return "mt-6 items-end justify-between";
}

export function ProjectCard({
  project,
  isStacked = false,
  className = "",
  featured = false,
  wideOnTablet = false,
}: ProjectCardProps): React.JSX.Element {
  const CardIcon = project.cardIcon;
  const layout = resolveCardLayout(featured, wideOnTablet);
  const isBanner = layout === "featured" || layout === "wideOnTablet";
  const shadowClass = getShadowClass(isStacked);

  return (
    <article
      className={`group relative flex overflow-visible rounded-none border-2 border-black bg-white dark:border-white dark:bg-neutral-900 ${shadowClass} ${getArticleLayoutClass(layout)} ${className}`}
    >
      <ProjectCardPattern pattern={project.cardPattern} color={project.accentColor} />

      <div
        className={`relative z-10 flex shrink-0 items-start justify-between gap-4 ${getHeaderLayoutClass(layout)}`}
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
        className={`relative z-10 flex min-w-0 flex-1 flex-col ${getBodyLayoutClass(layout)}`}
      >
        <p className="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">
          {project.eyebrow}
        </p>
        <h3
          className={`mt-2 font-bold text-neutral-950 dark:text-white ${getTitleClass(isBanner)}`}
        >
          {project.title}
        </h3>
        <p className="mt-1 text-lg font-medium text-neutral-800 dark:text-white/85">
          {project.role}
        </p>
        <p
          className={`max-w-[70ch] leading-relaxed text-neutral-600 dark:text-neutral-400 ${getSummaryClass(layout)}`}
        >
          {project.summary}
        </p>
      </div>

      <div
        className={`relative z-10 flex shrink-0 gap-4 ${getFooterLayoutClass(layout)}`}
      >
        <p className="text-sm font-medium text-neutral-500">{project.cardMeta}</p>

        <div className="flex shrink-0 items-center gap-2">
          {isSafeHref(project.repoUrl) ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={formatExternalLinkLabel("Код")}
              className={`${pressButtonClassName} bg-neutral-100 text-neutral-900 dark:bg-black dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}
            >
              <FaGithub aria-hidden="true" /> Код
            </a>
          ) : null}
          {project.liveUrl !== undefined && isSafeHref(project.liveUrl) ? (
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
}
