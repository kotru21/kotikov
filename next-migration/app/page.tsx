"use client";

import Header from "./components/Header";
import AboutMe from "./components/AboutMe";
import TechStack from "./components/TechStack";
import Interests from "./components/Interests";
import Stats from "./components/Stats";
import GitHub from "./components/GitHub";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <AboutMe />
      <TechStack />
      <Interests />
      <Stats />
      <GitHub />
      <Footer />
    </>
  );
}
