import React from "react";

import { Section, SectionHeader } from "@/shared/ui";

import ProjectCardDeck from "./ProjectCardDeck";
import ProjectsGrid from "./ProjectsGrid";

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

      <ProjectsGrid />
    </Section>
  );
};

export default ProjectsView;
