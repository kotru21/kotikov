"use client";

import React from "react";
import { colors } from "@/styles/colors";
import { SkillsMarquee } from "./index";

const SkillsDesktopView: React.FC = () => {
  return (
    <section
      id="skills"
      className="py-20"
      style={{ backgroundColor: colors.background.primary }}>
      <div className="max-w-full mx-auto">
        {/* Бегущая строка скиллов */}
        <SkillsMarquee />
      </div>
    </section>
  );
};

export default SkillsDesktopView;
