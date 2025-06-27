import React from "react";

interface CatPawProps {
  x: number;
  y: number;
  isActive: boolean;
  velocity: { x: number; y: number };
}

const CatPaw: React.FC<CatPawProps> = ({ x, y, isActive, velocity }) => {
  // Рассчитываем угол поворота на основе скорости движения
  const rotationAngle =
    Math.atan2(velocity.y, velocity.x) * (180 / Math.PI) * 0.1;
  const tiltAngle = isActive ? Math.max(-15, Math.min(15, rotationAngle)) : 0;

  // Более плавное масштабирование на основе скорости
  const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
  const scaleBoost = 1 + Math.min(speed * 0.01, 0.2);

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: x - 25,
        top: y - 25,
        transform: `translate3d(0, 0, 0) scale(${
          isActive ? scaleBoost : 1
        }) rotate(${tiltAngle}deg)`,
        transition: "transform 0.6s cubic-bezier(0.23, 1, 0.320, 1)",
        willChange: "transform",
      }}>
      <div
        className={`text-4xl transition-all duration-500 ease-out select-none ${
          isActive ? "drop-shadow-lg scale-110" : "scale-100"
        }`}
        style={{
          filter: isActive
            ? "drop-shadow(0 8px 16px rgba(219, 39, 119, 0.3))"
            : "none",
          transform: `${isActive ? "scale(1.1)" : "scale(1)"} rotate(${
            velocity.x * 2
          }deg)`,
        }}>
        🐾
      </div>
    </div>
  );
};

export default CatPaw;
