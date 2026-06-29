import React from "react";

import { aboutContent } from "@/shared/config/content";
import { Section, SectionHeader } from "@/shared/ui";

const AboutView: React.FC = () => {
  return (
    <Section
      id="about"
      backgroundClassName="bg-background-primary dark:bg-background-tertiary"
    >
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <SectionHeader
            eyebrow="Обо мне"
            title={aboutContent.title}
            description={aboutContent.body}
          />
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
    </Section>
  );
};

export default AboutView;
