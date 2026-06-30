import React from "react";

import { aboutContent } from "@/shared/config/content";

const commentToneClass = "text-text-secondary dark:text-neutral-400";
const keywordClass = "text-text-primary font-bold dark:text-text-inverse";
const stringClass = "text-primary-900 dark:text-primary-300";
const keyClass = "text-text-primary dark:text-text-inverse";
const promptClass = "text-primary-500";
const commitTypeClass = "text-primary-800 font-bold dark:text-primary-400";

function toCommentLines(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

const principlesCommentLine = "// principles";

const AboutSpecPanel: React.FC = () => {
  const { body, spec, principles } = aboutContent;
  const commentLines = toCommentLines(body);
  const accessiblePrinciples = principles.map((entry) => `${entry.type}: ${entry.text}`).join(". ");

  return (
    <figure className="w-full">
      <figcaption className="sr-only">
        {body} Принципы: {accessiblePrinciples}
      </figcaption>

      <div
        aria-hidden="true"
        className="border-y-2 border-r-2 border-l-4 border-black border-l-primary-500 bg-white dark:border-white dark:border-l-primary-400 dark:bg-black"
      >
        <div className="border-black/15 border-b-2 dark:border-white/20">
          <span className="inline-flex border-r-2 border-black bg-primary-500 px-4 py-2 text-xs font-bold tracking-wide text-black uppercase dark:border-white">
            {spec.fileName}
          </span>
        </div>

        <pre className="overflow-x-auto p-4 text-[0.8125rem] leading-relaxed font-mono sm:p-6 sm:text-sm">
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
            {"};\n\n"}
            <span className={commentToneClass}>{principlesCommentLine}</span>
            {"\n"}
            {principles.map((entry) => (
              <React.Fragment key={entry.type}>
                <span className={promptClass}>{"> "}</span>
                <span className={commitTypeClass}>{entry.type}</span>
                {": "}
                {entry.text}
                {"\n"}
              </React.Fragment>
            ))}
          </code>
        </pre>
      </div>
    </figure>
  );
};

export default AboutSpecPanel;
