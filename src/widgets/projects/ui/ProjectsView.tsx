import React from "react";

import { ProjectCard } from "@/entities/project";
import { projectsData } from "@/shared/config/content";
import { Section, SectionHeader } from "@/shared/ui";

import ProjectCardDeck from "./ProjectCardDeck";

const ProjectsView: React.FC = () => {
  return (
    <Section id="projects" backgroundClassName="bg-neutral-100 dark:bg-background-tertiary">
      <SectionHeader
        eyebrow="Проекты"
        title="Избранные работы"
        description="Несколько проектов, которые показывают, как я думаю о продукте, интерфейсе и реализации."
      />

      <div className="md:hidden">
        <ProjectCardDeck />
      </div>

      <div className="hidden gap-5 md:grid md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {projectsData.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
};

export default ProjectsView;
