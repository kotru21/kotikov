import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { FaGithub } from "react-icons/fa";

import { formatExternalLinkLabel, isSafeHref } from "@/shared/lib";
import { CELL_HOVER, GRID_STROKE, GRID_SURFACE, TEAL_FILL } from "@/shared/ui";

import type { ProjectItem } from "../model/types";

interface ProjectCardProps {
  project: ProjectItem;
  className?: string;
  /** Full-width featured banner in `ProjectsGrid` (row from `md`, stacked below). */
  featured?: boolean;
  /** Orphan grid card is short/horizontal from `md` to `xl`. Owned by `ProjectsGrid`. */
  wideOnTablet?: boolean;
}

type CardLayout = "default" | "wideOnTablet" | "featured";

const LINK_CLASS = `${GRID_STROKE} ${CELL_HOVER} inline-flex min-h-11 cursor-pointer items-center gap-1.5 px-4 text-xs font-bold uppercase focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#111] dark:focus-visible:ring-[#ededed]`;

function resolveCardLayout(featured: boolean, wideOnTablet: boolean): CardLayout {
  if (featured) return "featured";
  if (wideOnTablet) return "wideOnTablet";
  return "default";
}

function getArticleLayoutClass(layout: CardLayout): string {
  const stacked = "h-full min-h-0 min-w-0 w-full flex-col gap-5 p-5 sm:p-6";
  if (layout === "featured") {
    return `${stacked} md:min-h-56 md:flex-row md:items-stretch md:gap-6 lg:min-h-64 lg:p-7`;
  }
  if (layout === "wideOnTablet") {
    return `${stacked} md:min-h-56 md:flex-row md:items-stretch md:gap-6 xl:min-h-0 xl:flex-col xl:gap-5 xl:p-7`;
  }
  return `${stacked} md:p-7`;
}

function getHeaderLayoutClass(layout: CardLayout): string {
  if (layout === "featured") return "flex-row md:flex-col";
  if (layout === "wideOnTablet") return "flex-row md:flex-col xl:flex-row";
  return "flex-row";
}

function getBodyLayoutClass(layout: CardLayout): string {
  if (layout === "featured") return "min-w-0 flex-1 justify-center pt-0";
  if (layout === "wideOnTablet") return "min-w-0 flex-1 justify-center pt-0 xl:justify-start";
  return "min-w-0 flex-1";
}

function getTitleClass(isBanner: boolean): string {
  if (isBanner) {
    return "break-words text-xl leading-tight font-black uppercase sm:text-2xl xl:text-[1.75rem]";
  }
  return "break-words text-2xl leading-tight font-black uppercase sm:text-[1.75rem]";
}

function getSummaryClass(layout: CardLayout): string {
  if (layout === "featured") return "mt-3 flex-1 text-sm sm:mt-4 sm:text-base";
  if (layout === "wideOnTablet") return "mt-3 flex-1 text-sm sm:text-base xl:mt-4";
  return "mt-4 flex-1 text-base";
}

function getFooterLayoutClass(layout: CardLayout): string {
  if (layout === "featured") {
    return "mt-auto flex-row flex-wrap items-end justify-between md:mt-0 md:flex-col md:flex-nowrap md:self-stretch";
  }
  if (layout === "wideOnTablet") {
    return "mt-auto flex-row flex-wrap items-end justify-between md:mt-0 md:flex-col md:flex-nowrap md:self-stretch xl:mt-auto xl:flex-row xl:flex-wrap";
  }
  return "mt-auto flex-row flex-wrap items-end justify-between";
}

function articleFill(featured: boolean): string {
  return featured ? TEAL_FILL : GRID_SURFACE;
}

function demoLinkClass(featured: boolean): string {
  if (featured) return `${LINK_CLASS} bg-[#111] text-[#f5f5f3]`;
  return `${LINK_CLASS} ${TEAL_FILL}`;
}

export function ProjectCard({
  project,
  className = "",
  featured = false,
  wideOnTablet = false,
}: ProjectCardProps): React.JSX.Element {
  const CardIcon = project.cardIcon;
  const layout = resolveCardLayout(featured, wideOnTablet);
  const isBanner = layout === "featured" || layout === "wideOnTablet";

  return (
    <article
      className={`group relative flex min-w-0 border-0 ${articleFill(featured)} ${getArticleLayoutClass(layout)} ${className}`}
    >
      <div
        className={`relative z-10 flex shrink-0 items-start justify-between gap-4 ${getHeaderLayoutClass(layout)}`}
      >
        <div
          className={`${GRID_STROKE} flex size-11 shrink-0 items-center justify-center text-[#111]`}
          style={{ backgroundColor: featured ? "#f5f5f3" : project.accentColor }}
        >
          <CardIcon className="size-6" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium">{project.cardPeriod}</p>
      </div>

      <div className={`relative z-10 flex flex-col ${getBodyLayoutClass(layout)}`}>
        <p className="text-xs font-semibold tracking-[0.14em] uppercase">{project.eyebrow}</p>
        <h3 className={`mt-2 ${getTitleClass(isBanner)}`}>{project.title}</h3>
        <p className="mt-1 text-lg font-medium">{project.role}</p>
        <p className={`max-w-[70ch] min-w-0 leading-relaxed ${getSummaryClass(layout)}`}>
          {project.summary}
        </p>
      </div>

      <div className={`relative z-10 flex shrink-0 gap-4 ${getFooterLayoutClass(layout)}`}>
        <p className="text-sm font-medium">{project.cardMeta}</p>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {isSafeHref(project.repoUrl) ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={formatExternalLinkLabel("Код")}
              className={LINK_CLASS}
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
              className={demoLinkClass(featured)}
            >
              <ArrowTopRightOnSquareIcon className="size-3.5" aria-hidden="true" /> Демо
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
