"use client";

import React, { useState } from "react";

import { ProjectCardExpandable } from "@/entities/project";
import { usePerformanceSettings } from "@/features/performance";
import { projectsData } from "@/shared/config/content";

const ProjectsGrid: React.FC = () => {
  const { reducedMotion } = usePerformanceSettings();
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  return (
    <div className="projects-grid-anchor hidden max-w-full min-w-0 md:block">
      <div
        className="projects-grid-shell max-w-full min-w-0"
        data-reduced-motion={reducedMotion ? "true" : "false"}
      >
        <div className="projects-grid max-w-full min-w-0 auto-rows-min">
          {projectsData.map((project) => (
            <ProjectCardExpandable
              key={project.slug}
              project={project}
              layout="desktop"
              isExpanded={expandedSlug === project.slug}
              onExpandedChange={setExpandedSlug}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsGrid;
