"use client";

import React, { useEffect, useRef } from "react";

import { ProjectCard } from "@/entities/project";
import { usePerformanceSettings } from "@/features/performance";
import { projectsData } from "@/shared/config/content";
import { DECK_MOTION_CLASS } from "@/shared/lib/deckTransform";

import { getDeckCardRole, getDeckTransform } from "./getDeckTransform";
import { useProjectDeck } from "./useProjectDeck";

const NAVIGATION_KEYS = new Set(["ArrowLeft", "ArrowRight", "Home", "End"]);

function willProjectIndexChange(key: string, activeIndex: number, count: number): boolean {
  if (count <= 1) return false;
  if (key === "Home") return activeIndex !== 0;
  if (key === "End") return activeIndex !== count - 1;
  return key === "ArrowLeft" || key === "ArrowRight";
}

const ProjectCardDeck: React.FC = () => {
  const projects = projectsData;
  const { reducedMotion } = usePerformanceSettings();
  const motionClass = reducedMotion ? "" : DECK_MOTION_CLASS;
  const controlRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const shouldFocusActiveControlRef = useRef(false);
  const { activeIndex, goTo, handleKeyDown, handleTouchStart, handleTouchEnd } = useProjectDeck({
    count: projects.length,
  });

  useEffect(() => {
    if (!shouldFocusActiveControlRef.current) return;
    shouldFocusActiveControlRef.current = false;
    controlRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  const handleControlsKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const isNavigationKey = NAVIGATION_KEYS.has(event.key);
    if (isNavigationKey) shouldFocusActiveControlRef.current = true;
    handleKeyDown(event);
    if (isNavigationKey && !willProjectIndexChange(event.key, activeIndex, projects.length)) {
      shouldFocusActiveControlRef.current = false;
    }
  };

  if (projects.length === 0) return null;

  return (
    <div role="region" aria-roledescription="карусель" aria-label="Избранные проекты">
      <div
        className="relative mx-auto grid w-full max-w-md"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {projects.map((project, index) => {
          const role = getDeckCardRole(index, activeIndex, projects.length);
          const deckStyle = getDeckTransform(role, reducedMotion);
          const isActive = deckStyle.isActive;

          return (
            <div
              key={project.slug}
              role={isActive ? "group" : undefined}
              aria-roledescription={isActive ? "слайд" : undefined}
              aria-label={
                isActive
                  ? `${String(index + 1)} из ${String(projects.length)}: ${project.title}`
                  : undefined
              }
              className={`col-start-1 row-start-1 origin-center ${motionClass}`}
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

      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- handles keyboard events bubbled from the native project buttons */}
      <div
        className="mt-3 flex items-center justify-center gap-1 px-1 py-2"
        role="group"
        aria-label="Выбор проекта"
        onKeyDown={handleControlsKeyDown}
      >
        {projects.map((project, index) => {
          const isSelected = index === activeIndex;

          return (
            <button
              key={project.slug}
              ref={(control) => {
                controlRefs.current[index] = control;
              }}
              type="button"
              aria-pressed={isSelected}
              aria-label={`Выбрать проект ${project.title}`}
              onClick={() => {
                goTo(index);
              }}
              className={`inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center p-3 ${motionClass} focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:outline-none`}
            >
              <span
                aria-hidden="true"
                className={`block h-2 w-6 rounded-none sm:w-7 ${
                  isSelected
                    ? "bg-black dark:bg-white"
                    : "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectCardDeck;
