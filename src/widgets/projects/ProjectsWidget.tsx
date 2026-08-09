import { projectsSection } from "@/shared/config/content";
import { Section, SectionHeader } from "@/shared/ui";

import { ProjectsViews } from "./ui/ProjectsViews";

/**
 * Projects section composition root (Server Component).
 * Responsive trees are owned by client `ProjectsViews` (dual-mount then prune).
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

      <ProjectsViews />
    </Section>
  );
}
