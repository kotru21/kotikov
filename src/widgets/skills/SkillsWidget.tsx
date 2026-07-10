import React from "react";

import { Section } from "@/shared/ui";

import { SkillsDesktopView, SkillsMobileView } from "./ui";

const SkillsWidget: React.FC = () => {
  return (
    <Section
      id="skills"
      spacing="dense"
      backgroundClassName="bg-background-primary dark:bg-background-tertiary"
      className="overflow-x-clip"
      innerClassName="relative z-10 max-w-full"
      aria-label="Навыки"
    >
      <div data-skills-view="mobile" className="md:hidden">
        <SkillsMobileView headingId="skills-heading-mobile" />
      </div>
      <div data-skills-view="desktop" className="hidden md:block">
        <SkillsDesktopView headingId="skills-heading-desktop" />
      </div>
    </Section>
  );
};

export default SkillsWidget;
