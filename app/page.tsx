import { ContactsWidget as Contacts } from "@/widgets/contacts";
import { FooterWidget as Footer } from "@/widgets/footer";
import { HeaderWidget as Header } from "@/widgets/header";
import { SkillsWidget as SkillsCards } from "@/widgets/skills";
import { TimelineWidget as Timeline } from "@/widgets/timeline";

import StructuredData from "./components/StructuredData";

export default function Home() {
  return (
    <main>
      <StructuredData />
      <Header />

      <SkillsCards />

      <Timeline />

      <Contacts />

      <Footer />
    </main>
  );
}
