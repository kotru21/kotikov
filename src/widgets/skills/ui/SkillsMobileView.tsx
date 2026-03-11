"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaLinkedinIn } from "react-icons/fa";

import { skillsData, social } from "@/shared/config/content";
import { Button } from "@/shared/ui";

import { SkillsInteractionProvider } from "../model/SkillsInteractionContext";
import { SkillMarqueeRow } from ".";

const SkillsMobileView: React.FC = () => {
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
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="bg-background-primary dark:bg-background-tertiary relative overflow-x-hidden py-12 transition-colors duration-300"
    >
      {/* Заголовок */}
      <div className="px-4 pb-8 text-center">
        <h2
          id="skills-heading"
          className="mb-4 text-4xl font-bold tracking-tighter text-black uppercase dark:text-white"
        >
          Мои Навыки
        </h2>
        <p className="mx-auto max-w-sm text-lg font-medium text-neutral-600 dark:text-neutral-400">
          Технологии и инструменты, которыми я владею
        </p>
      </div>

      {/* Кнопка LinkedIn над скиллами */}
      <div className="flex justify-center pb-8">
        <Button
          href={social.linkedin.url}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="lg"
          aria-label="Открыть мой профиль LinkedIn (откроется в новой вкладке)"
        >
          <FaLinkedinIn className="text-xl" aria-hidden="true" />
          <span>Смотреть мой LinkedIn</span>
        </Button>
      </div>

      {/* Бегущие строки скиллов — въезжают при появлении во вьюпорте */}
      <SkillsInteractionProvider>
        <div ref={rowsRef} className="flex flex-col gap-0">
          <div
            className="border-y-2 border-black bg-white py-4 dark:border-white dark:bg-black"
            style={{
              transform: visible ? "translateX(0)" : "translateX(-100%)",
              opacity: visible ? 1 : 0,
              transition: "transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.5s ease",
            }}
          >
            <SkillMarqueeRow skills={firstRow} speed={35} direction="left" />
          </div>
          <div
            className="border-b-2 border-black bg-white py-4 dark:border-white dark:bg-black"
            style={{
              transform: visible ? "translateX(0)" : "translateX(100%)",
              opacity: visible ? 1 : 0,
              transition:
                "transform 0.7s 0.1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.5s 0.1s ease",
            }}
          >
            <SkillMarqueeRow skills={secondRow} speed={45} direction="right" />
          </div>
        </div>
      </SkillsInteractionProvider>
    </section>
  );
};

export default SkillsMobileView;
