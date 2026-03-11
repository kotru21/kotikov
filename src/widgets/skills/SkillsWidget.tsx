"use client";

import React from "react";

import { useIsMobile } from "@/features/device";

import { SkillsDesktopView, SkillsMobileView } from "./ui";

const SkillsWidget: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <SkillsMobileView />;
  }

  return <SkillsDesktopView />;
};

export default SkillsWidget;
