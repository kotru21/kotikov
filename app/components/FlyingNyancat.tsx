import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useIsMobile } from "@/app/hooks/useIsMobile";

interface FlyingNyancatProps {
  size: "small" | "medium" | "large" | "xlarge";
  position: {
    top: string;
    left: string;
  };
  animationName: string;
  animationDuration: string;
  animationDelay?: string;
  zIndex?: number;
}

interface Pixel {
  id: number;
  x: number;
  y: number;
  color: string;
  velocityX: number;
  velocityY: number;
  size: number;
}

const FlyingNyancat: React.FC<FlyingNyancatProps> = ({
  size,
  position,
  animationName,
  animationDuration,
  animationDelay = "0s",
  zIndex = -5,
}) => {
  const [isExploded, setIsExploded] = useState(false);
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [explosionPosition, setExplosionPosition] = useState({ x: 0, y: 0 });
  const nyancatRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Генерация пикселей для взрыва
  const generatePixels = () => {
    const newPixels: Pixel[] = [];
    const numPixels =
      size === "small"
        ? 15
        : size === "medium"
        ? 25
        : size === "large"
        ? 35
        : 50;
    const colors = [
      "#ff0080",
      "#ff8000",
      "#ffff00",
      "#80ff00",
      "#00ff80",
      "#0080ff",
      "#8000ff",
      "#ff00ff",
      "#00ffff",
      "#ff4040",
    ];

    for (let i = 0; i < numPixels; i++) {
      newPixels.push({
        id: i,
        x: Math.random() * 40 - 20, // Начальная позиция относительно центра
        y: Math.random() * 40 - 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocityX: (Math.random() - 0.5) * 200, // Скорость разлета
        velocityY: (Math.random() - 0.5) * 200,
        size: Math.random() * 4 + 2, // Размер пикселя
      });
    }
    return newPixels;
  };

  // Обработка взрыва
  const handleExplode = () => {
    if (!isExploded && nyancatRef.current) {
      // Получаем текущую позицию нянкэта
      const rect = nyancatRef.current.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      const newExplosionPosition = {
        x: rect.left + scrollX + rect.width / 2,
        y: rect.top + scrollY + rect.height / 2,
      };

      setExplosionPosition(newExplosionPosition);
      setIsExploded(true);
      setPixels(generatePixels());

      // Возвращаем нянкэта через 3 секунды
      setTimeout(() => {
        setIsExploded(false);
        setPixels([]);
      }, 3000);
    }
  };

  // Обработчики событий
  const handleMouseEnter = () => {
    console.log("Mouse enter triggered, isMobile:", isMobile);
    if (!isMobile) {
      handleExplode();
    }
  };

  const handleClick = () => {
    console.log("Click triggered, isMobile:", isMobile);
    if (isMobile) {
      handleExplode();
    } else {
      // На десктопе тоже разрешим клик для тестирования
      handleExplode();
    }
  };

  // Анимация пикселей
  useEffect(() => {
    if (isExploded && pixels.length > 0) {
      const interval = setInterval(() => {
        setPixels((prevPixels) =>
          prevPixels.map((pixel) => ({
            ...pixel,
            x: pixel.x + pixel.velocityX * 0.02,
            y: pixel.y + pixel.velocityY * 0.02,
            velocityY: pixel.velocityY + 5, // Гравитация
          }))
        );
      }, 16); // ~60fps

      return () => clearInterval(interval);
    }
  }, [isExploded, pixels.length]);
  // Размеры в зависимости от размера
  const sizeConfig = {
    small: {
      width: 35,
      height: 23,
      trailSegments: 5,
      trailWidth: 18,
      trailHeight: 6,
    },
    medium: {
      width: 50,
      height: 33,
      trailSegments: 6,
      trailWidth: 25,
      trailHeight: 8,
    },
    large: {
      width: 70,
      height: 47,
      trailSegments: 8,
      trailWidth: 35,
      trailHeight: 12,
    },
    xlarge: {
      width: 120,
      height: 80,
      trailSegments: 12,
      trailWidth: 60,
      trailHeight: 20,
    },
  };

  const config = sizeConfig[size];
  const trailDelay =
    size === "small"
      ? 0.06
      : size === "medium"
      ? 0.08
      : size === "large"
      ? 0.1
      : 0.15;

  return (
    <>
      {/* Контейнер для нянкэта и взрыва */}
      <div
        style={{
          position: "absolute",
          top: position.top,
          left: position.left,
          zIndex: zIndex,
        }}>
        {/* Нянкэт */}
        {!isExploded && (
          <div
            ref={nyancatRef}
            style={{
              animation: `${animationName} ${animationDuration} linear infinite`,
              animationDelay: animationDelay,
              cursor: isMobile ? "pointer" : "default",
            }}
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
            onTouchStart={handleClick}>
            <Image
              src="/nyancat.svg"
              alt="Nyancat"
              width={config.width}
              height={config.height}
              style={{
                width: `${config.width}px`,
                height: "auto",
              }}
            />
          </div>
        )}
      </div>

      {/* Дополнительная невидимая область для взаимодействия поверх контента */}
      {zIndex < 0 && !isExploded && (
        <div
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
            width: `${config.width}px`,
            height: `${config.height}px`,
            zIndex: 10, // Высокий z-index для взаимодействия
            backgroundColor: "transparent",
            cursor: isMobile ? "pointer" : "default",
            animation: `${animationName} ${animationDuration} linear infinite`,
            animationDelay: animationDelay,
            pointerEvents: "auto",
          }}
          onMouseEnter={handleMouseEnter}
          onClick={handleClick}
          onTouchStart={handleClick}
        />
      )}

      {/* Пиксели взрыва */}
      {isExploded &&
        pixels.map((pixel) => (
          <div
            key={pixel.id}
            style={{
              position: "fixed",
              top: `${explosionPosition.y + pixel.y}px`,
              left: `${explosionPosition.x + pixel.x}px`,
              width: `${pixel.size}px`,
              height: `${pixel.size}px`,
              backgroundColor: pixel.color,
              zIndex: 9999, // Максимально высокий z-index для видимости
              borderRadius: "1px",
              opacity: 0.9,
              transition: "opacity 0.5s ease-out",
              pointerEvents: "none",
              boxShadow: "0 0 2px rgba(0,0,0,0.3)", // Небольшая тень для лучшей видимости
            }}
          />
        ))}

      {/* Радужный след */}
      {!isExploded &&
        Array.from({ length: config.trailSegments }, (_, i) => (
          <div
            key={`trail-${i}`}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              zIndex: zIndex - 1,
              animation: `${animationName} ${animationDuration} linear infinite`,
              animationDelay: `${parseFloat(animationDelay) + i * trailDelay}s`,
              opacity: Math.max(
                0.1,
                1 -
                  i *
                    (size === "small"
                      ? 0.18
                      : size === "medium"
                      ? 0.15
                      : size === "large"
                      ? 0.12
                      : 0.1)
              ),
            }}>
            <div
              style={{
                width: `${Math.max(
                  6,
                  config.trailWidth - i * (size === "small" ? 2 : 3)
                )}px`,
                height: `${Math.max(2, config.trailHeight - i * 1)}px`,
                background: `linear-gradient(90deg, 
                hsl(${
                  (i *
                    (size === "small"
                      ? 72
                      : size === "medium"
                      ? 60
                      : size === "large"
                      ? 45
                      : 30)) %
                  360
                }, 100%, ${
                  size === "small"
                    ? 75
                    : size === "medium"
                    ? 70
                    : size === "large"
                    ? 65
                    : 60
                }%),
                hsl(${
                  (i *
                    (size === "small"
                      ? 72
                      : size === "medium"
                      ? 60
                      : size === "large"
                      ? 45
                      : 30) +
                    (size === "small"
                      ? 144
                      : size === "medium"
                      ? 120
                      : size === "large"
                      ? 90
                      : 60)) %
                  360
                }, 100%, ${
                  size === "small"
                    ? 75
                    : size === "medium"
                    ? 70
                    : size === "large"
                    ? 65
                    : 60
                }%),
                hsl(${
                  (i *
                    (size === "small"
                      ? 72
                      : size === "medium"
                      ? 60
                      : size === "large"
                      ? 45
                      : 30) +
                    (size === "small"
                      ? 288
                      : size === "medium"
                      ? 240
                      : size === "large"
                      ? 180
                      : 120)) %
                  360
                }, 100%, ${
                  size === "small"
                    ? 75
                    : size === "medium"
                    ? 70
                    : size === "large"
                    ? 65
                    : 60
                }%)
              )`,
                borderRadius: `${
                  size === "small"
                    ? 1
                    : size === "medium"
                    ? 2
                    : size === "large"
                    ? 2
                    : 3
                }px`,
                transform: `translateX(-${
                  i *
                  (size === "small"
                    ? 5
                    : size === "medium"
                    ? 6
                    : size === "large"
                    ? 8
                    : 12)
                }px) translateY(${
                  (size === "small"
                    ? 8
                    : size === "medium"
                    ? 12
                    : size === "large"
                    ? 15
                    : 25) + i
                }px)`,
              }}
            />
          </div>
        ))}
    </>
  );
};

export default FlyingNyancat;
