"use client";

import React, { useId, useState } from "react";

import { aboutContent } from "@/shared/config/content";

type AboutPanelTab = "spec" | "principles";

const commentToneClass = "text-text-secondary dark:text-neutral-400";
const keywordClass = "text-text-primary font-bold dark:text-text-inverse";
const stringClass = "text-primary-900 dark:text-primary-300";
const keyClass = "text-text-primary dark:text-text-inverse";
const commitTypeClass = "text-primary-800 font-bold dark:text-primary-400";

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
  const { principles } = aboutContent;

  return (
    <ul className="flex list-none flex-col gap-3 p-4 sm:gap-4 sm:p-6">
      {principles.map((entry) => (
        <li
          key={entry.type}
          className="border-2 border-black bg-white dark:border-white dark:bg-black"
        >
          <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-baseline sm:gap-4 sm:p-4">
            <span
              className={`${commitTypeClass} bg-primary-500 inline-flex shrink-0 border-2 border-black px-2 py-0.5 font-mono text-xs tracking-wide uppercase dark:border-white`}
            >
              {entry.type}
            </span>
            <p className="text-text-primary dark:text-text-inverse text-sm leading-relaxed sm:text-base">
              {entry.text}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

const AboutSpecPanel: React.FC = () => {
  const { body, spec, principles } = aboutContent;
  const [activeTab, setActiveTab] = useState<AboutPanelTab>("spec");
  const baseId = useId();
  const accessiblePrinciples = principles.map((entry) => `${entry.type}: ${entry.text}`).join(". ");

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (currentIndex + delta + TAB_ORDER.length) % TAB_ORDER.length;
      setActiveTab(TAB_ORDER[nextIndex]);
    }
  }

  const panelTitle = activeTab === "spec" ? spec.fileName : TAB_LABELS.principles;

  return (
    <figure className="w-full max-w-[75ch]">
      <figcaption className="sr-only">
        {body} Принципы: {accessiblePrinciples}
      </figcaption>

      <div className="border-l-primary-500 dark:border-l-primary-400 border-y-2 border-r-2 border-l-4 border-black bg-white dark:border-white dark:bg-black">
        <div className="flex flex-wrap items-stretch border-b-2 border-black/15 dark:border-white/20">
          <span
            aria-hidden="true"
            className="bg-primary-500 inline-flex items-center border-r-2 border-black px-4 py-2 text-xs font-bold tracking-wide text-black uppercase dark:border-white"
          >
            {panelTitle}
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

        <div
          role="tabpanel"
          id={`${baseId}-spec-panel`}
          aria-labelledby={`${baseId}-spec-tab`}
          hidden={activeTab !== "spec"}
          aria-hidden="true"
        >
          <AboutSpecCode />
        </div>

        <div
          role="tabpanel"
          id={`${baseId}-principles-panel`}
          aria-labelledby={`${baseId}-principles-tab`}
          hidden={activeTab !== "principles"}
          aria-hidden="true"
        >
          <AboutPrinciplesList />
        </div>
      </div>
    </figure>
  );
};

export default AboutSpecPanel;
