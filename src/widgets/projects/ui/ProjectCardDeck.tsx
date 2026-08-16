"use client";

import { ProjectCard, type ProjectItem } from "@/entities/project";
import { projectsData, projectsSection } from "@/shared/config/content";
import {
  BandCarousel,
  bandCarouselSlideClass,
  useBandCarousel,
} from "@/shared/ui/BandCarousel";

const PREV_LABEL = "Предыдущий проект";
const NEXT_LABEL = "Следующий проект";

interface CarouselSlideProps {
  featured: boolean;
  isActive: boolean;
  project: ProjectItem;
}

function CarouselSlide({ featured, isActive, project }: CarouselSlideProps): React.JSX.Element {
  return (
    <div className={bandCarouselSlideClass(isActive)} aria-hidden={!isActive} inert={!isActive}>
      <ProjectCard project={project} featured={featured} />
    </div>
  );
}

export function ProjectCardDeck(): React.JSX.Element | null {
  const controls = useBandCarousel({ count: projectsData.length });

  if (projectsData.length === 0) return null;

  return (
    <BandCarousel
      label={projectsSection.title}
      total={projectsData.length}
      activeTitle={projectsData[controls.activeIndex]?.title ?? ""}
      prevLabel={PREV_LABEL}
      nextLabel={NEXT_LABEL}
      controls={controls}
      testId="projects-deck"
    >
      {projectsData.map((project, index) => (
        <CarouselSlide
          key={project.slug}
          project={project}
          featured={index === 0}
          isActive={index === controls.activeIndex}
        />
      ))}
    </BandCarousel>
  );
}
