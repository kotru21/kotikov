import React from "react";

import { Section } from "@/shared/ui";

import { SkillsViews } from "./ui";

const SkillsWidget: React.FC = () => {
  return (
    <Section
      id="skills"
      spacing="dense"
      contained={false}
      backgroundClassName="bg-background-primary dark:bg-background-tertiary"
      className="overflow-x-clip"
      innerClassName="relative z-10"
      aria-label="Навыки"
    >
      <SkillsViews />
    </Section>
  );
};

export default SkillsWidget;
