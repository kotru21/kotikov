import React from "react";
import { FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

import type { ProjectItem } from "../model/types";
import ProjectCardPattern from "./ProjectCardPattern";

interface ProjectCardProps {
  project: ProjectItem;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const CardIcon = project.cardIcon;

  return (
    <article className="group relative flex min-h-[22rem] flex-col overflow-hidden rounded-2xl bg-neutral-900 p-6 transition-transform duration-300 hover:-translate-y-1 sm:min-h-[24rem] sm:p-7">
      <ProjectCardPattern pattern={project.cardPattern} color={project.accentColor} />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-neutral-950"
          style={{ backgroundColor: project.accentColor }}
        >
          <CardIcon className="size-6" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-neutral-500">{project.cardPeriod}</p>
      </div>

      <div className="relative z-10 mt-auto pt-10">
        <p className="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">
          {project.eyebrow}
        </p>
        <h3 className="mt-2 text-2xl leading-tight font-bold text-white sm:text-[1.75rem]">
          {project.title}
        </h3>
        <p className="mt-1 text-lg font-medium text-white/85">{project.role}</p>
        <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-neutral-400">{project.summary}</p>
      </div>

      <div className="relative z-10 mt-6 flex items-end justify-between gap-4">
        <p className="text-sm font-medium text-neutral-500">{project.cardMeta}</p>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white uppercase backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            <FaGithub aria-hidden="true" /> Код
          </a>
          {project.liveUrl !== undefined ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-neutral-950 uppercase transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
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
