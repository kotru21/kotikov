import React from "react";

import { aboutContent } from "@/shared/config/content";

const AboutView: React.FC = () => {
  return (
    <section
      id="about"
      className="bg-background-primary dark:bg-background-tertiary relative px-6 py-20 transition-colors duration-300 lg:px-8"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-primary-950 dark:text-primary-300 mb-3 text-sm font-bold tracking-[0.24em] uppercase">
            Обо мне
          </p>
          <h2 className="text-text-primary dark:text-text-inverse text-4xl font-black tracking-tight uppercase sm:text-5xl">
            {aboutContent.title}
          </h2>
          <p className="text-text-secondary mt-5 max-w-xl text-lg leading-8 font-medium dark:text-neutral-300">
            {aboutContent.body}
          </p>
        </div>
        <ul className="grid content-start gap-4">
          {aboutContent.principles.map((principle) => (
            <li
              key={principle}
              className="text-text-primary dark:text-text-inverse border-2 border-black bg-white px-5 py-4 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            >
              {principle}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AboutView;
