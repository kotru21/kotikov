import { useEffect, useState, useRef } from "react";

interface UseMobileSkillsScrollOptions {
  skillsCount: number;
}

export const useMobileSkillsScroll = ({
  skillsCount,
}: UseMobileSkillsScrollOptions) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const previousScrollRef = useRef(0);
  const previousActiveIndexRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
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

          // Определяем направление скролла
          const currentScrollDirection =
            scrollTop > previousScrollRef.current ? "down" : "up";
          if (scrollTop !== previousScrollRef.current) {
            setScrollDirection(currentScrollDirection);
            previousScrollRef.current = scrollTop;
          }

          // Позиция скролла относительно начала секции скиллов
          const scrollInSection = scrollTop - skillsSectionTop;

          // Высота области заголовка (примерно 100vh)
          const headerHeight = viewportHeight;

          // Высота области, доступной для переключения карточек
          const availableScrollHeight =
            skillsSectionHeight - headerHeight - viewportHeight;

          if (scrollInSection <= 0) {
            // Еще не дошли до секции скиллов
            setScrollProgress(0);
            setActiveCardIndex(0);
            setTransitionProgress(0);
            setIsTransitioning(false);
          } else if (scrollInSection <= headerHeight) {
            // В области заголовка секции скиллов
            setScrollProgress(0);
            setActiveCardIndex(0);
            setTransitionProgress(0);
            setIsTransitioning(false);
          } else if (scrollInSection >= skillsSectionHeight - viewportHeight) {
            // Прошли секцию скиллов полностью
            setScrollProgress(1);
            setActiveCardIndex(skillsCount - 1);
            setTransitionProgress(0);
            setIsTransitioning(false);
          } else {
            // В области карточек
            const cardScrollPosition = scrollInSection - headerHeight;
            const progress = Math.max(
              0,
              Math.min(1, cardScrollPosition / availableScrollHeight)
            );

            // Каждая карточка занимает равную долю от общего прогресса
            const cardStep = 1 / Math.max(1, skillsCount - 1);

            // Вычисляем точную позицию в пределах карточек
            const exactPosition = progress / cardStep;
            const baseCardIndex = Math.floor(exactPosition);
            const nextCardIndex = Math.min(skillsCount - 1, baseCardIndex + 1);

            // Прогресс внутри текущего сегмента (0-1)
            const segmentProgress = exactPosition - baseCardIndex;

            // Определяем пороги для переходов
            const transitionThreshold = 0.3; // Простой порог в 30%

            let finalActiveIndex: number;
            let finalTransitionProgress: number;
            let finalIsTransitioning: boolean;

            if (segmentProgress < transitionThreshold) {
              // Находимся на базовой карточке
              finalActiveIndex = baseCardIndex;
              finalTransitionProgress = 0;
              finalIsTransitioning = false;
            } else if (segmentProgress > 1 - transitionThreshold) {
              // Находимся на следующей карточке
              finalActiveIndex = nextCardIndex;
              finalTransitionProgress = 0;
              finalIsTransitioning = false;
            } else {
              // В процессе перехода между карточками
              const transitionRange = 1 - 2 * transitionThreshold;
              const normalizedProgress =
                (segmentProgress - transitionThreshold) / transitionRange;

              finalActiveIndex = baseCardIndex;
              finalTransitionProgress = normalizedProgress;
              finalIsTransitioning = true;
            }

            setScrollProgress(progress);
            setActiveCardIndex(finalActiveIndex);
            setTransitionProgress(finalTransitionProgress);
            setIsTransitioning(finalIsTransitioning);

            // Обновляем ссылку на предыдущий индекс
            previousActiveIndexRef.current = finalActiveIndex;
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
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
