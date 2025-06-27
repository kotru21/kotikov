import React, { useEffect, useState } from "react";

interface CatPawProps {
  x: number;
  y: number;
  isActive: boolean;
  velocity: { x: number; y: number };
}

const CatPaw: React.FC<CatPawProps> = ({ x, y, isActive, velocity }) => {
  const [isVisible, setIsVisible] = useState(true);

  //  находится ли лапа в пределах секции контактов
  useEffect(() => {
    const checkBounds = () => {
      const contactsSection = document.getElementById("contacts-section");
      if (!contactsSection) {
        setIsVisible(false);
        return;
      }

      const rect = contactsSection.getBoundingClientRect();
      const pawSize = 50; // Размер лапы (25px от центра в каждую сторону)

      // находится ли лапа в пределах секции с небольшим отступом
      const isInBounds =
        x >= rect.left - pawSize &&
        x <= rect.right + pawSize &&
        y >= rect.top - pawSize &&
        y <= rect.bottom + pawSize;

      setIsVisible(isInBounds);
    };

    checkBounds();

    // слушатель события scroll для проверки границ при скролле
    const handleScroll = () => checkBounds();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [x, y]);

  //  угол поворота на основе скорости движения
  const rotationAngle =
    Math.atan2(velocity.y, velocity.x) * (180 / Math.PI) * 0.1;
  const tiltAngle = isActive ? Math.max(-15, Math.min(15, rotationAngle)) : 0;

  const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
  const scaleBoost = 1 + Math.min(speed * 0.01, 0.2);

  // лапа не отображается если за пределами секции
  if (!isVisible || !isActive) {
    return null;
  }

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: x - 25,
        top: y - 25,
        transform: `translate3d(0, 0, 0) scale(${scaleBoost}) rotate(${tiltAngle}deg)`,
        transition: "transform 0.6s cubic-bezier(0.23, 1, 0.320, 1)",
        willChange: "transform",
      }}>
      <div
        className="text-4xl transition-all duration-500 ease-out select-none drop-shadow-lg scale-110"
        style={{
          filter: "drop-shadow(0 8px 16px rgba(219, 39, 119, 0.3))",
          transform: `scale(1.1) rotate(${velocity.x * 2}deg)`,
        }}>
        🐾
      </div>
    </div>
  );
};

export default CatPaw;
