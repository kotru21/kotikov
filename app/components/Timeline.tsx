"use client";

import React from "react";
import { useHorizontalScroll } from "../hooks/useHorizontalScroll";
import TimelineView from "./Timeline/TimelineView";

export default function Timeline() {
  const { containerRef, sectionRef } = useHorizontalScroll({
    enabled: true,
    scrollMultiplier: 2,
  });

  return <TimelineView containerRef={containerRef} sectionRef={sectionRef} />;
}
