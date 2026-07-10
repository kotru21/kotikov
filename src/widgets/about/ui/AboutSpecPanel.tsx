"use client";

import React, { useId, useState } from "react";

import { aboutContent } from "@/shared/config/content";

type AboutPanelTab = "spec" | "principles";

const commentToneClass = "text-text-secondary dark:text-neutral-400";
const keywordClass = "text-text-primary font-bold dark:text-text-inverse";
const stringClass = "text-primary-900 dark:text-primary-300";
const keyClass = "text-text-primary dark:text-text-inverse";

const TAB_ORDER: AboutPanelTab[] = ["spec", "principles"];

const TAB_LABELS: Record<AboutPanelTab, string> = {
  spec: "Spec",
  principles: "Принципы",
};

function toCommentLines(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function AboutSpecCode(): React.ReactElement {
  const { body, spec } = aboutContent;
  const commentLines = toCommentLines(body);

  return (
    <pre className="overflow-x-auto p-4 font-mono text-[0.8125rem] leading-relaxed sm:p-6 sm:text-sm">
      <code>
        <span className={commentToneClass}>{"/**"}</span>
        {"\n"}
        {commentLines.map((line) => (
          <React.Fragment key={line}>
            <span className={commentToneClass}>{` * ${line}`}</span>
            {"\n"}
          </React.Fragment>
        ))}
        <span className={commentToneClass}>{" */"}</span>
        {"\n\n"}
        <span className={keywordClass}>export const</span> {spec.exportName} = {"{\n"}
        {spec.fields.map((field, index) => (
          <React.Fragment key={field.key}>
            {"  "}
            <span className={keyClass}>{field.key}</span>
            {": "}
            <span className={stringClass}>&quot;{field.value}&quot;</span>
            {index < spec.fields.length - 1 ? ",\n" : "\n"}
          </React.Fragment>
        ))}
        {"};\n"}
      </code>
    </pre>
  );
}

function AboutPrinciplesList(): React.ReactElement {
  return (
    <ul className="flex list-none flex-col justify-center gap-4 p-4 sm:gap-5 sm:p-6">
      {aboutContent.principles.map((line) => (
        <li
          key={line}
          className="text-text-primary dark:text-text-inverse text-sm leading-relaxed sm:text-base"
        >
          {line}
        </li>
      ))}
    </ul>
  );
}

function panelVisibilityClass(isActive: boolean): string {
  return isActive ? "visible z-10" : "invisible pointer-events-none z-0";
}

const AboutSpecPanel: React.FC = () => {
  const { body, spec, principles } = aboutContent;
  const [activeTab, setActiveTab] = useState<AboutPanelTab>("spec");
  const baseId = useId();

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (currentIndex + delta + TAB_ORDER.length) % TAB_ORDER.length;
      setActiveTab(TAB_ORDER[nextIndex]);
    }
  }

  return (
    <figure className="w-full max-w-[75ch]">
      <figcaption className="sr-only">
        {body} Принципы: {principles.join(". ")}
      </figcaption>

      <div className="border-l-primary-500 dark:border-l-primary-400 border-y-2 border-r-2 border-l-4 border-black bg-white dark:border-white dark:bg-black">
        <div className="flex flex-wrap items-stretch border-b-2 border-black/15 dark:border-white/20">
          <span
            aria-hidden="true"
            className="bg-primary-500 inline-flex items-center border-r-2 border-black px-4 py-2 text-xs font-bold tracking-wide text-black uppercase dark:border-white"
          >
            {spec.fileName}
          </span>

          <div role="tablist" aria-label="Вид блока Обо мне" className="ml-auto flex">
            {TAB_ORDER.map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  id={`${baseId}-${tab}-tab`}
                  aria-selected={isSelected}
                  aria-controls={`${baseId}-${tab}-panel`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setActiveTab(tab)}
                  onKeyDown={handleTabKeyDown}
                  className={[
                    "inline-flex items-center border-l-2 border-black px-3 py-2 text-xs font-bold tracking-wide uppercase transition-colors duration-[var(--motion-micro)] motion-reduce:transition-none focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:outline-none dark:border-white sm:px-4",
                    isSelected
                      ? "bg-primary-500 text-black"
                      : "text-text-primary hover:bg-primary-500/40 dark:text-text-inverse dark:hover:bg-primary-500/30 bg-transparent",
                  ].join(" ")}
                >
                  {TAB_LABELS[tab]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stack both faces in one grid cell: height = max(Spec, Principles), no CLS on switch */}
        <div data-about-tab-stack className="grid">
          <div
            role="tabpanel"
            id={`${baseId}-spec-panel`}
            aria-labelledby={`${baseId}-spec-tab`}
            aria-hidden={activeTab !== "spec"}
            className={`col-start-1 row-start-1 ${panelVisibilityClass(activeTab === "spec")}`}
          >
            <AboutSpecCode />
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-principles-panel`}
            aria-labelledby={`${baseId}-principles-tab`}
            aria-hidden={activeTab !== "principles"}
            className={`col-start-1 row-start-1 ${panelVisibilityClass(activeTab === "principles")}`}
          >
            <AboutPrinciplesList />
          </div>
        </div>
      </div>
    </figure>
  );
};

export default AboutSpecPanel;
