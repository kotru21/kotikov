import { ProjectCard } from "@/entities/project";
import { projectsData } from "@/shared/config/content";

function isOrphanOnTablet(index: number, total: number): boolean {
  if (index === 0) return false;
  const remaining = total - 1;
  return remaining % 2 === 1 && index === total - 1;
}

function getGridItemClass(isFeatured: boolean, wideOnTablet: boolean): string {
  const fill = "h-full min-h-0";
  if (isFeatured) return `${fill} col-span-full`;
  if (wideOnTablet) return `${fill} max-xl:col-span-2`;
  return fill;
}

export function ProjectsGrid(): React.JSX.Element {
  const total = projectsData.length;

  return (
    <div
      className="grid grid-cols-1 content-start items-stretch border-t-2 border-[#111] md:grid-cols-2 xl:grid-cols-3 dark:border-[#ededed]"
      data-testid="projects-grid"
    >
      {projectsData.map((project, index) => {
        const isFeatured = index === 0;
        const wideOnTablet = isOrphanOnTablet(index, total);

        return (
          <div key={project.slug} className={getGridItemClass(isFeatured, wideOnTablet)}>
            <ProjectCard project={project} featured={isFeatured} wideOnTablet={wideOnTablet} />
          </div>
        );
      })}
    </div>
  );
}
