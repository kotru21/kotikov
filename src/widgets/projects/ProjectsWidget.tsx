import { projectsSection } from "@/shared/config/content";
import { Section, SectionHeader } from "@/shared/ui";

import { ProjectCardDeck, ProjectsGrid } from "./ui";

/**
 * Projects section composition root (Server Component).
 * Intentionally dual-mounts mobile deck + desktop grid; visibility is CSS-only
 * (`md:hidden` / `hidden md:grid`) so breakpoints stay layout-stable.
 */
export function ProjectsWidget(): React.JSX.Element {
  return (
    <Section
      id="projects"
      tabIndex={-1}
      backgroundClassName="bg-neutral-100 dark:bg-background-tertiary"
    >
      <SectionHeader
        eyebrow={projectsSection.eyebrow}
        title={projectsSection.title}
        description={projectsSection.description}
      />

      <div className="md:hidden">
        <ProjectCardDeck />
      </div>

      <ProjectsGrid />
    </Section>
  );
}
