import React from "react";
import Image from "next/image";

const HeaderNyancat: React.FC = () => {
  return (
    <>
      {/* Анимированный Nyancat */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "-150px",
          zIndex: 1,
          animation: "nyancat-fly 15s linear infinite",
        }}>
        <Image
          src="/nyancat.svg"
          alt="Nyancat"
          width={120}
          height={80}
          style={{
            width: "120px",
            height: "auto",
          }}
        />
      </div>

      {/* Радужный след */}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "20%",
            left: "-150px",
            zIndex: 0,
            animation: `nyancat-fly 15s linear infinite`,
            animationDelay: `${i * 0.15}s`,
            opacity: Math.max(0.1, 1 - i * 0.08),
          }}>
          <div
            style={{
              width: `${Math.max(20, 60 - i * 4)}px`,
              height: `${Math.max(8, 20 - i * 1)}px`,
              background: `linear-gradient(90deg, 
                hsl(${(i * 30) % 360}, 100%, 60%),
                hsl(${(i * 30 + 60) % 360}, 100%, 60%),
                hsl(${(i * 30 + 120) % 360}, 100%, 60%)
              )`,
              borderRadius: "4px",
              transform: `translateX(-${i * 12}px) translateY(${25 + i}px)`,
            }}
          />
        </div>
      ))}

      {/* Стили анимации */}
      <style jsx>{`
        @keyframes nyancat-fly {
          0% {
            transform: translateX(-150px) translateY(0px);
          }
          12.5% {
            transform: translateX(12.5vw) translateY(-40px);
          }
          25% {
            transform: translateX(25vw) translateY(0px);
          }
          37.5% {
            transform: translateX(37.5vw) translateY(40px);
          }
          50% {
            transform: translateX(50vw) translateY(0px);
          }
          62.5% {
            transform: translateX(62.5vw) translateY(-40px);
          }
          75% {
            transform: translateX(75vw) translateY(0px);
          }
          87.5% {
            transform: translateX(87.5vw) translateY(40px);
          }
          100% {
            transform: translateX(calc(100vw + 150px)) translateY(0px);
          }
        }
      `}</style>
    </>
  );
};

export default HeaderNyancat;
