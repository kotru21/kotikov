import React from "react";

import type { ProjectItem } from "../model/types";

interface ProjectCardDetailGridProps {
  project: ProjectItem;
  id: string;
  isVisible: boolean;
  reducedMotion?: boolean;
}

const motionCellClass = (index: number, isVisible: boolean, reducedMotion: boolean): string => {
  if (reducedMotion) return "opacity-100 translate-y-0";
  if (!isVisible) return "opacity-0 -translate-y-1";
  const delays = ["delay-0", "delay-75", "delay-150", "delay-200"];
  return `opacity-100 translate-y-0 transition-[opacity,transform] duration-300 ease-out ${delays[index] ?? ""}`;
};

const ProjectCardDetailGrid: React.FC<ProjectCardDetailGridProps> = ({
  project,
  id,
  isVisible,
  reducedMotion = false,
}) => {
  const transitionClass = reducedMotion ? "" : "transition-[opacity,transform] duration-300 ease-out";

  return (
    <section
      id={id}
      aria-label="Подробности проекта"
      aria-hidden={!isVisible}
      className={`relative border-t-2 border-black dark:border-white ${transitionClass} ${
        isVisible ? "max-h-[32rem] opacity-100" : "max-h-0 overflow-hidden opacity-0"
      }`}
    >
      <div
        aria-hidden="true"
        className={`absolute top-3 right-3 size-12 rounded-full border-2 border-black dark:border-white ${
          reducedMotion ? "scale-100 opacity-60" : "transition-transform duration-400 ease-out"
        } ${isVisible ? "scale-100 opacity-60" : "scale-0 opacity-0"}`}
        style={{ backgroundColor: project.accentColor }}
      />

      <dl className="relative z-10">
        <div
          className={`border-b-2 border-black px-4 py-3 dark:border-white ${motionCellClass(0, isVisible, reducedMotion)}`}
          style={{ backgroundColor: project.accentColor }}
        >
          <dt className="text-xs font-bold tracking-[0.12em] text-neutral-950 uppercase">Задача</dt>
          <dd className="mt-1 text-sm leading-relaxed font-medium text-neutral-950">
            {project.details.challenge}
          </dd>
        </div>

        <div
          className={`border-b-2 border-black bg-white px-4 py-3 dark:border-white dark:bg-neutral-900 ${motionCellClass(1, isVisible, reducedMotion)}`}
        >
          <dt className="text-xs font-bold tracking-[0.12em] text-neutral-700 uppercase dark:text-neutral-300">
            Решение
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
            {project.details.solution}
          </dd>
        </div>

        <div
          className={`border-b-2 border-black bg-black px-4 py-3 dark:border-white dark:bg-white ${motionCellClass(2, isVisible, reducedMotion)}`}
        >
          <dt className="text-xs font-bold tracking-[0.12em] text-white uppercase dark:text-black">
            Результат
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-white dark:text-black">
            {project.details.outcome}
          </dd>
        </div>

        <div
          className={`bg-neutral-100 px-4 py-3 dark:bg-neutral-800 ${motionCellClass(3, isVisible, reducedMotion)}`}
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
