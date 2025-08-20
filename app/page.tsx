import {
  HeaderWidget as Header,
  SkillsWidget as SkillsCards,
  TimelineWidget as Timeline,
  ContactsWidget as Contacts,
  FooterWidget as Footer,
} from "@/widgets";
import StructuredData from "./components/StructuredData";

export default function Home() {
  return (
    <div>
      <StructuredData />
      <Header />

      <SkillsCards />

      <Timeline />

      <Contacts />

      <Footer />
    </div>
  );
}
