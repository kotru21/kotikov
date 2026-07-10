import React from "react";

import { aboutContent } from "@/shared/config/content";

const commentToneClass = "text-text-secondary dark:text-neutral-400";
const keywordClass = "text-text-primary font-bold dark:text-text-inverse";
const stringClass = "text-primary-900 dark:text-primary-300";
const keyClass = "text-text-primary dark:text-text-inverse";

function toCommentLines(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

const AboutSpecPanel: React.FC = () => {
  const { body, spec, principles } = aboutContent;
  const commentLines = toCommentLines(body);
  const accessiblePrinciples = principles.join(". ");

  return (
    <figure className="w-full max-w-[75ch]">
      <figcaption className="sr-only">
        {body} Принципы: {accessiblePrinciples}
      </figcaption>

      <div
        aria-hidden="true"
        className="border-l-primary-500 dark:border-l-primary-400 border-y-2 border-r-2 border-l-4 border-black bg-white dark:border-white dark:bg-black"
      >
        <div className="border-b-2 border-black/15 dark:border-white/20">
          <span className="bg-primary-500 inline-flex border-r-2 border-black px-4 py-2 text-xs font-bold tracking-wide text-black uppercase dark:border-white">
            {spec.fileName}
          </span>
        </div>

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
      </div>
    </figure>
  );
};

export default AboutSpecPanel;
