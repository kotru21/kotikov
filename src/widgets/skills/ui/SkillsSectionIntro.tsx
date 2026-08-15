import { sectionTitles } from "@/shared/config/content";
import { GIANT_LABEL } from "@/shared/ui/gridChrome";

const HEADING_ID = "skills-heading";

/** Section h2 stays in the a11y tree on mobile (`sr-only`); spine is visual-only. */
export function SkillsSectionIntro(): React.JSX.Element {
  return (
    <h2 id={HEADING_ID} className={`sr-only md:not-sr-only ${GIANT_LABEL} md:p-10`}>
      {sectionTitles.skills}
    </h2>
  );
}
