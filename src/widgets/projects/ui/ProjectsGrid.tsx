"use client";

import React, { useState } from "react";

import { ProjectCardExpandable } from "@/entities/project/ui/ProjectCardExpandable";
import { projectsData } from "@/shared/config/content";

const ProjectsGrid: React.FC = () => {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  return (
    <div className="hidden auto-rows-min gap-5 md:grid md:grid-cols-2 md:gap-6 xl:grid-cols-3">
      {projectsData.map((project) => (
        <ProjectCardExpandable
          key={project.slug}
          project={project}
          layout="desktop"
          isExpanded={expandedSlug === project.slug}
          onExpandedChange={setExpandedSlug}
        />
      ))}
    </div>
  );
};

export default ProjectsGrid;
