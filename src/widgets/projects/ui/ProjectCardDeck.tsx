"use client";

import React from "react";

import { ProjectCard } from "@/entities/project";
import { usePerformanceSettings } from "@/features/performance";
import { projectsData } from "@/shared/config/content";

import { getDeckCardRole, getDeckTransform } from "./getDeckTransform";
import { useProjectDeck } from "./useProjectDeck";

const deckMotionClass = "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";

const ProjectCardDeck: React.FC = () => {
  const projects = projectsData;
  const { reducedMotion } = usePerformanceSettings();
  const motionClass = reducedMotion ? "" : deckMotionClass;
  const { activeIndex, goTo, handleKeyDown, handleTouchStart, handleTouchEnd } = useProjectDeck({
    count: projects.length,
  });

  if (projects.length === 0) return null;

  const activeProject = projects[activeIndex];
  const panelId = `project-panel-${activeProject.slug}`;

  return (
    <div aria-roledescription="carousel" aria-label="Избранные проекты">
      <div
        className="relative mx-auto w-full max-w-md"
        style={{ minHeight: "calc(28rem + 1.5rem)" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {projects.map((project, index) => {
          const role = getDeckCardRole(index, activeIndex, projects.length);
          const deckStyle = getDeckTransform(role, reducedMotion);
          const isActive = deckStyle.isActive;
          const tabId = `project-tab-${project.slug}`;

          return (
            <div
              key={project.slug}
              id={isActive ? panelId : undefined}
              role={isActive ? "tabpanel" : undefined}
              aria-labelledby={isActive ? tabId : undefined}
              className={`absolute inset-x-0 top-0 origin-center ${motionClass}`}
              style={{
                zIndex: deckStyle.zIndex,
                transform: deckStyle.transform,
                opacity: deckStyle.opacity,
              }}
              aria-hidden={!isActive}
              {...(!isActive ? { inert: true } : {})}
            >
              {!isActive ? (
                <button
                  type="button"
                  className="absolute inset-0 z-10 min-h-11"
                  aria-label={`Показать проект ${project.title}`}
                  onClick={() => {
                    goTo(index);
                  }}
                />
              ) : null}
              <div className={isActive ? undefined : "pointer-events-none"}>
                <ProjectCard project={project} isStacked={!isActive} />
              </div>
            </div>
          );
        })}
      </div>

      <p
        className="text-text-secondary mt-6 text-center text-xs font-bold tracking-[0.2em] uppercase dark:text-neutral-400"
        aria-live="polite"
      >
        {activeIndex + 1} / {projects.length}
      </p>

      <div
        className="focus-visible:ring-primary-500 mt-3 flex items-center justify-center gap-1 px-1 py-2 outline-none focus-visible:ring-2"
        role="tablist"
        aria-label="Избранные проекты"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {projects.map((project, index) => {
          const tabId = `project-tab-${project.slug}`;
          const isSelected = index === activeIndex;

          return (
            <button
              key={project.slug}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              aria-label={project.title}
              onClick={() => {
                goTo(index);
              }}
              className={`h-2 min-w-6 shrink-0 rounded-none sm:min-w-7 ${motionClass} focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:outline-none ${
                isSelected
                  ? "bg-black dark:bg-white"
                  : "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProjectCardDeck;
