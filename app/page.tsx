import { GRID_BAND_STACK, GRID_DIVIDE } from "@/shared/ui";
import { AboutWidget as About } from "@/widgets/about";
import { ContactsWidget as Contacts } from "@/widgets/contacts";
import { FooterWidget as Footer } from "@/widgets/footer";
import { ProjectsWidget as Projects } from "@/widgets/projects";
import { PuzzleHome } from "@/widgets/puzzle";
import { SiteFrame } from "@/widgets/shell";
import { SkillsWidget as Skills } from "@/widgets/skills";
import { TimelineWidget as Experience } from "@/widgets/timeline";

import { SkipLinks } from "./components/SkipLinks";
import StructuredData from "./components/StructuredData";

export default function Home(): React.JSX.Element {
  return (
    <>
      <SkipLinks />
      <StructuredData />
      <SiteFrame puzzle={<PuzzleHome />}>
        <div className={GRID_BAND_STACK}>
          <main className={GRID_DIVIDE} id="main-content" tabIndex={-1}>
            <About />
            <Projects />
            <Skills />
            <Experience />
            <Contacts />
          </main>
          <Footer />
        </div>
      </SiteFrame>
    </>
  );
}
