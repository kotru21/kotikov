"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaLinkedinIn } from "react-icons/fa";

import { usePerformanceSettings } from "@/features/performance";
import { skillsData, social } from "@/shared/config/content";
import { formatExternalLinkLabel } from "@/shared/lib";
import { Button, Section, SectionHeader } from "@/shared/ui";

import { SkillsInteractionProvider } from "../model/SkillsInteractionContext";
import { SkillMarqueeRow, SkillsGroupedTags } from ".";

const SkillsMobileView: React.FC = () => {
  const { reducedMotion, lowPerformance } = usePerformanceSettings();
  const showMarquee = !reducedMotion && !lowPerformance;

  const mid = Math.ceil(skillsData.length / 2);
  const firstRow = skillsData.slice(0, mid);
  const secondRow = skillsData.slice(mid);

  const rowsRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rowsRef.current;
    if (el === null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Section
      id="skills"
      spacing="dense"
      backgroundClassName="bg-background-primary dark:bg-background-tertiary"
      className="overflow-x-hidden"
      innerClassName=""
      aria-labelledby="skills-heading"
    >
      <SectionHeader
        align="center"
        eyebrow="Навыки"
        title="Мои навыки"
        titleId="skills-heading"
        description="Технологии и инструменты, которыми я владею"
      />
      <p className="text-text-secondary mx-auto -mt-4 mb-8 max-w-sm text-center text-base font-semibold dark:text-neutral-300">
        React, JavaScript, Node.js, фреймворк Next.js
      </p>

      {/* Кнопка LinkedIn над скиллами */}
      <div className="flex justify-center pb-8">
        <Button
          href={social.linkedin.url}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="lg"
          aria-label={formatExternalLinkLabel("Смотреть мой LinkedIn")}
        >
          <FaLinkedinIn className="text-xl" aria-hidden="true" />
          <span>Смотреть мой LinkedIn</span>
        </Button>
      </div>

      {/* Бегущие строки скиллов — въезжают при появлении во вьюпорте; только при включённой анимации */}
      {showMarquee ? (
        <SkillsInteractionProvider>
          <div ref={rowsRef} className="-mx-6 flex flex-col gap-2">
            <div
              style={{
                transform: visible ? "translateX(0)" : "translateX(-100%)",
                opacity: visible ? 1 : 0,
                transition: "transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.5s ease",
              }}
            >
              <SkillMarqueeRow
                curved
                arcHeight={44}
                skills={firstRow}
                speed={35}
                direction="left"
              />
            </div>
            <div
              style={{
                transform: visible ? "translateX(0)" : "translateX(100%)",
                opacity: visible ? 1 : 0,
                transition:
                  "transform 0.7s 0.1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.5s 0.1s ease",
              }}
            >
              <SkillMarqueeRow
                curved
                arcHeight={44}
                skills={secondRow}
                speed={45}
                direction="right"
              />
            </div>
          </div>
        </SkillsInteractionProvider>
      ) : null}

      {/* Сгруппированные теги навыков — всегда видны */}
      <SkillsGroupedTags />
    </Section>
  );
};

export default SkillsMobileView;
