import { sectionTitles } from "@/shared/config/content";
import { GIANT_LABEL, GRID_SURFACE, Section } from "@/shared/ui";

import { TimelineView } from "./ui";

/** Experience section composition root (Server Component). Carousel lives in TimelineView. */
export default function TimelineWidget(): React.JSX.Element {
  return (
    <Section id="experience" contained={false} spacing="none" backgroundClassName={GRID_SURFACE}>
      <h2 className={`sr-only md:not-sr-only ${GIANT_LABEL} md:p-10`} id="experience-heading">
        {sectionTitles.experience}
      </h2>
      <TimelineView />
    </Section>
  );
}
