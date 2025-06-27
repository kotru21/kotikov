import React from "react";
import Image from "next/image";

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

const FlyingNyancat: React.FC<FlyingNyancatProps> = ({
  size,
  position,
  animationName,
  animationDuration,
  animationDelay = "0s",
  zIndex = -5,
}) => {
  // Размеры в зависимости от размера
  const sizeConfig = {
    small: { width: 35, height: 23, trailSegments: 5, trailWidth: 18, trailHeight: 6 },
    medium: { width: 50, height: 33, trailSegments: 6, trailWidth: 25, trailHeight: 8 },
    large: { width: 70, height: 47, trailSegments: 8, trailWidth: 35, trailHeight: 12 },
    xlarge: { width: 120, height: 80, trailSegments: 12, trailWidth: 60, trailHeight: 20 },
  };

  const config = sizeConfig[size];
  const trailDelay = size === "small" ? 0.06 : size === "medium" ? 0.08 : size === "large" ? 0.1 : 0.15;

  return (
    <>
      {/* Нянкэт */}
      <div
        style={{
          position: "absolute",
          top: position.top,
          left: position.left,
          zIndex: zIndex,
          animation: `${animationName} ${animationDuration} linear infinite`,
          animationDelay: animationDelay,
        }}>
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

      {/* Радужный след */}
      {Array.from({ length: config.trailSegments }, (_, i) => (
        <div
          key={`trail-${i}`}
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
            zIndex: zIndex - 1,
            animation: `${animationName} ${animationDuration} linear infinite`,
            animationDelay: `${parseFloat(animationDelay) + i * trailDelay}s`,
            opacity: Math.max(0.1, 1 - i * (size === "small" ? 0.18 : size === "medium" ? 0.15 : size === "large" ? 0.12 : 0.1)),
          }}>
          <div
            style={{
              width: `${Math.max(6, config.trailWidth - i * (size === "small" ? 2 : 3))}px`,
              height: `${Math.max(2, config.trailHeight - i * 1)}px`,
              background: `linear-gradient(90deg, 
                hsl(${(i * (size === "small" ? 72 : size === "medium" ? 60 : size === "large" ? 45 : 30)) % 360}, 100%, ${size === "small" ? 75 : size === "medium" ? 70 : size === "large" ? 65 : 60}%),
                hsl(${(i * (size === "small" ? 72 : size === "medium" ? 60 : size === "large" ? 45 : 30) + (size === "small" ? 144 : size === "medium" ? 120 : size === "large" ? 90 : 60)) % 360}, 100%, ${size === "small" ? 75 : size === "medium" ? 70 : size === "large" ? 65 : 60}%),
                hsl(${(i * (size === "small" ? 72 : size === "medium" ? 60 : size === "large" ? 45 : 30) + (size === "small" ? 288 : size === "medium" ? 240 : size === "large" ? 180 : 120)) % 360}, 100%, ${size === "small" ? 75 : size === "medium" ? 70 : size === "large" ? 65 : 60}%)
              )`,
              borderRadius: `${size === "small" ? 1 : size === "medium" ? 2 : size === "large" ? 2 : 3}px`,
              transform: `translateX(-${i * (size === "small" ? 5 : size === "medium" ? 6 : size === "large" ? 8 : 12)}px) translateY(${(size === "small" ? 8 : size === "medium" ? 12 : size === "large" ? 15 : 25) + i}px)`,
            }}
          />
        </div>
      ))}
    </>
  );
};

export default FlyingNyancat;
