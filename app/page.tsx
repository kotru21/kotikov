import Header from "./components/Header";
import SkillsCards from "./components/SkillsCards";
import Timeline from "./components/Timeline";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";
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
