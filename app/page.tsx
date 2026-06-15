import { AboutWidget as About } from "@/widgets/about";
import { ContactsWidget as Contacts } from "@/widgets/contacts";
import { FooterWidget as Footer } from "@/widgets/footer";
import { HeaderWidget as Header } from "@/widgets/header";
import { ProjectsWidget as Projects } from "@/widgets/projects";
import { SkillsWidget as Skills } from "@/widgets/skills";
import { TimelineWidget as Experience } from "@/widgets/timeline";

import StructuredData from "./components/StructuredData";

export default function Home(): React.JSX.Element {
  return (
    <>
      <main>
        <StructuredData />
        <Header />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
