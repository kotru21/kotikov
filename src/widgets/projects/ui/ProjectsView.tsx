import React from "react";

import { ProjectCard } from "@/entities/project";
import { projectsData } from "@/shared/config/content";

import ProjectCardDeck from "./ProjectCardDeck";

const ProjectsView: React.FC = () => {
  return (
    <section
      id="projects"
      className="relative bg-neutral-100 px-6 py-20 transition-colors duration-300 dark:bg-[#0a0a0a] lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="text-primary-950 dark:text-primary-300 mb-3 text-sm font-bold tracking-[0.24em] uppercase">
            Проекты
          </p>
          <h2 className="text-text-primary dark:text-text-inverse text-4xl font-black tracking-tight uppercase sm:text-5xl">
            Избранные работы
          </h2>
          <p className="text-text-secondary mt-4 max-w-2xl text-lg leading-8 font-medium dark:text-neutral-400">
            Несколько проектов, которые показывают, как я думаю о продукте, интерфейсе и реализации.
          </p>
        </div>

        <div className="sm:hidden">
          <ProjectCardDeck />
        </div>

        <div className="hidden gap-5 sm:grid sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          {projectsData.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsView;
