import { GRID_SURFACE, Section } from "@/shared/ui";

import { SkillsSectionIntro } from "./ui/SkillsSectionIntro";
import SkillsViews from "./ui/SkillsViews";

/** Skills section composition root (Server Component). Nyancat lives in SkillsViews. */
export default function SkillsWidget(): React.JSX.Element {
  return (
    <Section id="skills" contained={false} spacing="none" backgroundClassName={GRID_SURFACE}>
      <SkillsViews heading={<SkillsSectionIntro />} />
    </Section>
  );
}
