"use client";

import { ProjectCard, type ProjectItem } from "@/entities/project";
import { projectsData, projectsSection } from "@/shared/config/content";
import { CELL_HOVER, GRID_SURFACE } from "@/shared/ui";

import { useProjectDeck } from "./useProjectDeck";

const PREV_LABEL = "Предыдущий проект";
const NEXT_LABEL = "Следующий проект";
/** One cell: band height is max-content of every slide, including `invisible` copies. */
const SLIDE_CELL = "col-start-1 row-start-1 grid min-w-0";

type DeckControls = ReturnType<typeof useProjectDeck>;

interface ChevronButtonProps {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}

function ChevronButton({ direction, disabled, onClick }: ChevronButtonProps): React.JSX.Element {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? PREV_LABEL : NEXT_LABEL}
      className={`${GRID_SURFACE} ${CELL_HOVER} flex min-h-11 min-w-11 cursor-pointer items-center justify-center px-3 font-black disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#111] dark:focus-visible:ring-[#ededed]`}
    >
      <span aria-hidden="true">{isPrev ? "<<" : ">>"}</span>
    </button>
  );
}

function slideClassName(isActive: boolean): string {
  if (isActive) return `visible ${SLIDE_CELL}`;
  return `invisible pointer-events-none ${SLIDE_CELL}`;
}

function deckRegionLabel(index: number, total: number): string {
  return `${projectsSection.title}, ${String(index + 1)} из ${String(total)}`;
}

function DeckLiveStatus({
  index,
  title,
  total,
}: {
  index: number;
  title: string;
  total: number;
}): React.JSX.Element {
  return (
    <div className="sr-only" aria-atomic="true" aria-live="polite">
      {`${String(index + 1)} из ${String(total)}: ${title}`}
    </div>
  );
}

interface CarouselSlideProps {
  featured: boolean;
  isActive: boolean;
  project: ProjectItem;
}

function CarouselSlide({ featured, isActive, project }: CarouselSlideProps): React.JSX.Element {
  return (
    <div className={slideClassName(isActive)} aria-hidden={!isActive}>
      <ProjectCard project={project} featured={featured} />
    </div>
  );
}

interface CarouselSlidesProps {
  activeIndex: number;
}

function CarouselSlides({ activeIndex }: CarouselSlidesProps): React.JSX.Element {
  return (
    <div className="grid min-w-0">
      {projectsData.map((project, index) => (
        <CarouselSlide
          key={project.slug}
          project={project}
          featured={index === 0}
          isActive={index === activeIndex}
        />
      ))}
    </div>
  );
}

interface CarouselTrackProps {
  controls: DeckControls;
}

function CarouselTrack({ controls }: CarouselTrackProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto]">
      <ChevronButton direction="prev" disabled={!controls.canGoPrev} onClick={controls.goPrev} />
      <CarouselSlides activeIndex={controls.activeIndex} />
      <ChevronButton direction="next" disabled={!controls.canGoNext} onClick={controls.goNext} />
    </div>
  );
}

export function ProjectCardDeck(): React.JSX.Element | null {
  const controls = useProjectDeck({ count: projectsData.length });

  if (projectsData.length === 0) return null;

  /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- spec: arrow keys on the focused carousel band */
  return (
    <div
      role="region"
      aria-roledescription="карусель"
      aria-label={deckRegionLabel(controls.activeIndex, projectsData.length)}
      tabIndex={0}
      data-testid="projects-deck"
      onKeyDown={controls.handleKeyDown}
      onTouchStart={controls.handleTouchStart}
      onTouchEnd={controls.handleTouchEnd}
      onTouchCancel={controls.handleTouchCancel}
      className="border-t-2 border-[#111] outline-none focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-inset dark:border-[#ededed] dark:focus-visible:ring-[#ededed]"
    >
      <DeckLiveStatus
        index={controls.activeIndex}
        title={projectsData[controls.activeIndex]?.title ?? ""}
        total={projectsData.length}
      />
      <CarouselTrack controls={controls} />
    </div>
  );
  /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
}
