import React from "react";

import { ProjectCard } from "@/entities/project";
import { projectsData } from "@/shared/config/content";

const ProjectsGrid: React.FC = () => {
  return (
    <div
      className="hidden auto-rows-min gap-6 md:grid md:grid-cols-2 xl:grid-cols-3"
      data-testid="projects-grid"
    >
      {projectsData.map((project, index) => {
        const isLast = index === projectsData.length - 1;

        return (
          <div key={project.slug} className={isLast ? "max-xl:col-span-2" : undefined}>
            <ProjectCard project={project} wideOnTablet={isLast} />
          </div>
        );
      })}
    </div>
  );
};

export default ProjectsGrid;
