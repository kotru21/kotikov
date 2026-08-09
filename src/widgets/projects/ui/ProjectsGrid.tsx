import { ProjectCard } from "@/entities/project";
import { projectsData } from "@/shared/config/content";

function isOrphanOnTablet(index: number, total: number): boolean {
  if (index === 0) return false;
  const remaining = total - 1;
  return remaining % 2 === 1 && index === total - 1;
}

export function ProjectsGrid(): React.JSX.Element {
  const total = projectsData.length;

  return (
    <div
      className="hidden auto-rows-min gap-6 md:grid md:grid-cols-2 xl:grid-cols-3"
      data-testid="projects-grid"
    >
      {projectsData.map((project, index) => {
        const isFeatured = index === 0;
        const wideOnTablet = isOrphanOnTablet(index, total);

        return (
          <div
            key={project.slug}
            className={
              isFeatured ? "col-span-full" : wideOnTablet ? "max-xl:col-span-2" : undefined
            }
          >
            <ProjectCard
              project={project}
              featured={isFeatured}
              wideOnTablet={wideOnTablet}
            />
          </div>
        );
      })}
    </div>
  );
}
