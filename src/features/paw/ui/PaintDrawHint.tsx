"use client";

import React from "react";

import { useIsMobile } from "@/features/device";
import { InteractiveElement, InteractiveText } from "@/features/interactive-elements";
import { colors } from "@/styles/colors";

interface PaintDrawHintProps {
  tone?: "default" | "on-gradient";
  className?: string;
}

const toneClasses = {
  default: "text-text-secondary dark:text-neutral-400",
  "on-gradient": "text-neutral-100/90",
} as const;

const PaintDrawHint: React.FC<PaintDrawHintProps> = ({ tone = "default", className = "" }) => {
  const isMobile = useIsMobile();
  const message = isMobile
    ? "Зажми палец и веди — оставь след лапы"
    : "Проведи мышью — оставь след лапы";

  const interactiveProps =
    tone === "on-gradient"
      ? {
          "data-draw-allow": true,
          "data-interactive-mode": "solid" as const,
          "data-interactive-bg": colors.primary[500],
          "data-interactive-text": "black",
          "data-interactive-threshold": "0.08",
        }
      : {
          "data-draw-allow": true,
          "data-interactive-color": colors.text.primary,
          "data-interactive-threshold": "0.08",
        };

  return (
    <InteractiveElement
      as="p"
      {...interactiveProps}
      className={`text-xs font-bold tracking-[0.18em] uppercase ${toneClasses[tone]} ${className}`.trim()}
    >
      <InteractiveText text={message} />
    </InteractiveElement>
  );
};

export default PaintDrawHint;
