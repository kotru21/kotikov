import { sectionTitles } from "@/shared/config/content";
import { GIANT_LABEL } from "@/shared/ui/gridChrome";

const HEADING_ID = "skills-heading";

/** In-page section title — visible on mobile so bands don't run together. */
export function SkillsSectionIntro(): React.JSX.Element {
  return (
    <h2 id={HEADING_ID} className={`${GIANT_LABEL} p-6 md:p-10`}>
      {sectionTitles.skills}
    </h2>
  );
}
