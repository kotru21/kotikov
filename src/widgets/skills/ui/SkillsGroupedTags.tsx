import React from "react";

import { skillGroups } from "@/shared/config/content";

const SkillsGroupedTags: React.FC = () => {
  return (
    <div className="mx-auto mt-12 grid max-w-5xl gap-6 px-4 md:grid-cols-3">
      {skillGroups.map((group) => (
        <div
          key={group.title}
          className="border-2 border-black bg-white p-5 dark:border-white dark:bg-black"
        >
          <h3 className="text-text-primary dark:text-text-inverse mb-3 text-lg font-black uppercase">
            {group.title}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li
                key={item}
                className="text-text-primary dark:text-text-inverse bg-background-primary border border-black px-2 py-1 text-xs font-bold dark:border-white dark:bg-neutral-900"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SkillsGroupedTags;
