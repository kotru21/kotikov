import React from "react";

import { aboutContent } from "@/shared/config/content";
import { BauhausGridPattern, Section, SectionHeader } from "@/shared/ui";

import AboutSpecPanel from "./AboutSpecPanel";

const AboutView: React.FC = () => {
  return (
    <Section
      id="about"
      backgroundClassName="bg-background-primary dark:bg-background-tertiary"
      innerClassName="relative z-10"
    >
      <BauhausGridPattern className="text-black dark:text-white" opacity={0.03} />

      <div className="flex w-full flex-col gap-8 lg:gap-10">
        <SectionHeader
          eyebrow="Обо мне"
          title={aboutContent.title}
          titleId="about-heading"
        />

        <AboutSpecPanel />
      </div>
    </Section>
  );
};

export default AboutView;
