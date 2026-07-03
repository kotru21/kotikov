import React from "react";

import type { ProjectItem } from "../model/types";

type ProjectCardDetailOrientation = "vertical" | "horizontal";

interface ProjectCardDetailGridProps {
  project: ProjectItem;
  id: string;
  isVisible: boolean;
  reducedMotion?: boolean;
  orientation?: ProjectCardDetailOrientation;
}

const motionCellClass = (
  index: number,
  isVisible: boolean,
  reducedMotion: boolean,
  orientation: ProjectCardDetailOrientation,
): string => {
  if (reducedMotion) {
    return "opacity-100 translate-x-0 translate-y-0";
  }

  if (!isVisible) {
    return orientation === "horizontal" ? "opacity-0 -translate-x-2" : "opacity-0 -translate-y-1";
  }

  const delays = ["delay-0", "delay-75", "delay-150", "delay-200"];
  return `opacity-100 translate-x-0 translate-y-0 transition-[opacity,transform] duration-300 ease-out ${delays[index] ?? ""}`;
};

function getVisibilityClass(isHorizontal: boolean, isVisible: boolean): string {
  if (isHorizontal) {
    return isVisible
      ? "min-h-0 self-stretch opacity-100"
      : "pointer-events-none invisible h-0 max-h-0 min-h-0 overflow-hidden opacity-0";
  }

  return isVisible ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0";
}

function getBorderClass(isHorizontal: boolean, isVisible: boolean): string {
  if (isHorizontal) {
    return isVisible
      ? "border-l-2 border-black dark:border-white"
      : "border-l-0";
  }

  return "border-t-2 border-black dark:border-white";
}

const ProjectCardDetailGrid: React.FC<ProjectCardDetailGridProps> = ({
  project,
  id,
  isVisible,
  reducedMotion = false,
  orientation = "vertical",
}) => {
  const isHorizontal = orientation === "horizontal";
  const transitionClass = reducedMotion
    ? ""
    : "transition-[opacity,border-color] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

  const visibilityClass = getVisibilityClass(isHorizontal, isVisible);
  const borderClass = getBorderClass(isHorizontal, isVisible);

  return (
    <section
      id={id}
      aria-label="Подробности проекта"
      aria-hidden={!isVisible}
      className={`relative overflow-hidden ${borderClass} ${transitionClass} ${visibilityClass} ${
        isHorizontal && isVisible ? "h-full" : ""
      }`}
    >
      <div
        aria-hidden="true"
        className={`absolute border-2 border-black dark:border-white ${
          isHorizontal ? "top-3 right-3" : "top-3 right-3"
        } size-12 rounded-full ${
          reducedMotion ? "scale-100 opacity-60" : "transition-transform duration-[400ms] ease-out"
        } ${isVisible ? "scale-100 opacity-60" : "scale-0 opacity-0"}`}
        style={{ backgroundColor: project.accentColor }}
      />

      <dl
        className={`relative z-10 h-full ${isHorizontal ? "grid h-full min-h-[22rem] grid-cols-2 grid-rows-2 sm:min-h-[24rem]" : ""}`}
      >
        <div
          className={`${
            isHorizontal
              ? "border-r-2 border-b-2 border-black dark:border-white"
              : "border-b-2 border-black dark:border-white"
          } px-4 py-3 ${motionCellClass(0, isVisible, reducedMotion, orientation)}`}
          style={{ backgroundColor: project.accentColor }}
        >
          <dt className="text-xs font-bold tracking-[0.12em] text-neutral-950 uppercase">Задача</dt>
          <dd className="mt-1 text-sm leading-relaxed font-medium text-neutral-950">
            {project.details.challenge}
          </dd>
        </div>

        <div
          className={`${
            isHorizontal
              ? "border-b-2 border-black bg-white dark:border-white dark:bg-neutral-900"
              : "border-b-2 border-black bg-white dark:border-white dark:bg-neutral-900"
          } px-4 py-3 ${motionCellClass(1, isVisible, reducedMotion, orientation)}`}
        >
          <dt className="text-xs font-bold tracking-[0.12em] text-neutral-700 uppercase dark:text-neutral-300">
            Решение
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
            {project.details.solution}
          </dd>
        </div>

        <div
          className={`${
            isHorizontal
              ? "border-r-2 border-black bg-black dark:border-white dark:bg-white"
              : "border-b-2 border-black bg-black dark:border-white dark:bg-white"
          } px-4 py-3 ${motionCellClass(2, isVisible, reducedMotion, orientation)}`}
        >
          <dt className="text-xs font-bold tracking-[0.12em] text-white uppercase dark:text-black">
            Результат
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-white dark:text-black">
            {project.details.outcome}
          </dd>
        </div>

        <div
          className={`bg-neutral-100 px-4 py-3 dark:bg-neutral-800 ${motionCellClass(3, isVisible, reducedMotion, orientation)}`}
        >
          <dt className="text-xs font-bold tracking-[0.12em] text-neutral-700 uppercase dark:text-neutral-300">
            Стек
          </dt>
          <dd className="mt-2 flex flex-wrap gap-1.5">
            {project.stack.map((item) => (
              <span
                key={item}
                className="rounded-none border-2 border-black bg-white px-2 py-0.5 text-xs font-bold text-neutral-900 uppercase dark:border-white dark:bg-neutral-900 dark:text-white"
              >
                {item}
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </section>
  );
};

export default ProjectCardDetailGrid;
export { ProjectCardDetailGrid };
export type { ProjectCardDetailOrientation };
