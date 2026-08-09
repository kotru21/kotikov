import React from "react";

import { Section, SectionHeader } from "@/shared/ui";

import { TimelineView } from "./ui";

/**
 * Timeline section composition root (Server Component).
 * Responsive trees are owned by client `TimelineView`.
 */
const TimelineWidget: React.FC = () => (
  <Section
    id="experience"
    backgroundClassName="bg-background-primary dark:bg-background-tertiary"
    className="md:overflow-x-clip"
    innerClassName="relative z-10"
  >
    <SectionHeader
      eyebrow="Опыт"
      title="Мой путь"
      titleId="experience-heading"
      description="Образование и опыт работы"
    />
    <TimelineView />
  </Section>
);

export default TimelineWidget;
