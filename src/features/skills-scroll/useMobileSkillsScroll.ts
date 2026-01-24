"use client";

import { useEffect, useRef, useState } from "react";

interface UseMobileSkillsScrollOptions {
  skillsCount: number;
}

interface UseMobileSkillsScrollReturn {
  scrollProgress: number;
  activeCardIndex: number;
  transitionProgress: number;
  isTransitioning: boolean;
  scrollDirection: "up" | "down";
  previousActiveIndex: number;
}

export const useMobileSkillsScroll = ({
  skillsCount,
}: UseMobileSkillsScrollOptions): UseMobileSkillsScrollReturn => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const previousScrollRef = useRef(0);
  const previousActiveIndexRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = (): void => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const skillsSection = document.getElementById("skills");
          if (!skillsSection) {
            ticking = false;
            return;
          }

          const viewportHeight = window.innerHeight;
          const scrollTop = window.scrollY;
          const skillsSectionTop = skillsSection.offsetTop;
          const skillsSectionHeight = skillsSection.offsetHeight;

          const currentScrollDirection = scrollTop > previousScrollRef.current ? "down" : "up";
          if (scrollTop !== previousScrollRef.current) {
            setScrollDirection(currentScrollDirection);
            previousScrollRef.current = scrollTop;
          }

          const scrollInSection = scrollTop - skillsSectionTop;
          const headerHeight = viewportHeight;
          const availableScrollHeight = skillsSectionHeight - headerHeight - viewportHeight;

          if (scrollInSection <= 0) {
            setScrollProgress(0);
            setActiveCardIndex(0);
            setTransitionProgress(0);
            setIsTransitioning(false);
          } else if (scrollInSection <= headerHeight) {
            setScrollProgress(0);
            setActiveCardIndex(0);
            setTransitionProgress(0);
            setIsTransitioning(false);
          } else if (scrollInSection >= skillsSectionHeight - viewportHeight) {
            setScrollProgress(1);
            setActiveCardIndex(skillsCount - 1);
            setTransitionProgress(0);
            setIsTransitioning(false);
          } else {
            const cardScrollPosition = scrollInSection - headerHeight;
            const progress = Math.max(0, Math.min(1, cardScrollPosition / availableScrollHeight));

            const cardStep = 1 / Math.max(1, skillsCount - 1);
            const exactPosition = progress / cardStep;
            const baseCardIndex = Math.floor(exactPosition);
            const nextCardIndex = Math.min(skillsCount - 1, baseCardIndex + 1);

            const segmentProgress = exactPosition - baseCardIndex;
            const transitionThreshold = 0.3;

            let finalActiveIndex: number;
            let finalTransitionProgress: number;
            let finalIsTransitioning: boolean;

            if (segmentProgress < transitionThreshold) {
              finalActiveIndex = baseCardIndex;
              finalTransitionProgress = 0;
              finalIsTransitioning = false;
            } else if (segmentProgress > 1 - transitionThreshold) {
              finalActiveIndex = nextCardIndex;
              finalTransitionProgress = 0;
              finalIsTransitioning = false;
            } else {
              const transitionRange = 1 - 2 * transitionThreshold;
              const normalizedProgress = (segmentProgress - transitionThreshold) / transitionRange;

              finalActiveIndex = baseCardIndex;
              finalTransitionProgress = normalizedProgress;
              finalIsTransitioning = true;
            }

            setScrollProgress(progress);
            setActiveCardIndex(finalActiveIndex);
            setTransitionProgress(finalTransitionProgress);
            setIsTransitioning(finalIsTransitioning);
            previousActiveIndexRef.current = finalActiveIndex;
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [skillsCount]);

  return {
    scrollProgress,
    activeCardIndex,
    transitionProgress,
    isTransitioning,
    scrollDirection,
    previousActiveIndex: previousActiveIndexRef.current,
  };
};
