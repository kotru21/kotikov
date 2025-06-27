import { useEffect, useState } from "react";

interface UseMobileSkillsScrollOptions {
  skillsCount: number;
}

export const useMobileSkillsScroll = ({
  skillsCount,
}: UseMobileSkillsScrollOptions) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const skillsSection = document.getElementById("skills");
      if (!skillsSection) return;

      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const skillsSectionTop = skillsSection.offsetTop;
      const skillsSectionHeight = skillsSection.offsetHeight;

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
      } else if (scrollInSection <= headerHeight) {
        // В области заголовка секции скиллов
        setScrollProgress(0);
        setActiveCardIndex(0);
      } else if (scrollInSection >= skillsSectionHeight - viewportHeight) {
        // Прошли секцию скиллов полностью
        setScrollProgress(1);
        setActiveCardIndex(skillsCount - 1);
      } else {
        // В области карточек
        const cardScrollPosition = scrollInSection - headerHeight;
        const progress = Math.max(
          0,
          Math.min(1, cardScrollPosition / availableScrollHeight)
        );

        // Каждая карточка занимает равную долю от общего прогресса
        const cardProgress = 1 / (skillsCount - 1);

        // Добавляем небольшой порог для переключения карточек
        const threshold = cardProgress * 0.5; // 50% от ширины одной карточки
        const adjustedIndex = Math.min(
          skillsCount - 1,
          Math.max(0, Math.round((progress + threshold) / cardProgress))
        );

        setScrollProgress(progress);
        setActiveCardIndex(adjustedIndex);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [skillsCount]);

  return {
    scrollProgress,
    activeCardIndex,
  };
};
