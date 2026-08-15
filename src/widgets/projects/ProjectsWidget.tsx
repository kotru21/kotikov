import { projectsSection } from "@/shared/config/content";
import { GIANT_LABEL, GRID_SURFACE, Section } from "@/shared/ui";

import { ProjectsGrid } from "./ui/ProjectsGrid";
import { ProjectsMobileDeck } from "./ui/ProjectsMobileDeck";

/** Projects section composition root (Server Component). Mobile deck is the only client island. */
export function ProjectsWidget(): React.JSX.Element {
  return (
    <Section
      id="projects"
      tabIndex={-1}
      contained={false}
      spacing="none"
      backgroundClassName={GRID_SURFACE}
    >
      <div className="flex flex-col justify-start gap-6 p-6 md:p-10">
        <h2 className={`sr-only md:not-sr-only ${GIANT_LABEL}`} id="projects-heading">
          {projectsSection.title}
        </h2>
        <p className="text-base leading-8 font-medium text-[#111] dark:text-[#ededed]">
          {projectsSection.description}
        </p>
      </div>
      <ProjectsMobileDeck />
      <div className="hidden md:block" data-projects-view="desktop">
        <ProjectsGrid />
      </div>
    </Section>
  );
}
