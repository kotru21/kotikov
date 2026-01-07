"use client";

import React from "react";

import { useHorizontalScroll } from "@/features/scrolling";

import { TimelineView } from "./ui";

const TimelineWidget: React.FC = () => {
  const { containerRef, sectionRef } = useHorizontalScroll({
    enabled: true,
    scrollMultiplier: 2,
  });

  return <TimelineView containerRef={containerRef} sectionRef={sectionRef} />;
};

export default TimelineWidget;
