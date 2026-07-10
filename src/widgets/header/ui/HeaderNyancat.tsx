"use client";

import React from "react";

import { FlyingNyancat } from "@/features/nyancat";

interface HeaderNyancatProps {
  isMotionActive: boolean;
}

const HeaderNyancat: React.FC<HeaderNyancatProps> = ({ isMotionActive }) => {
  return (
    <>
      <FlyingNyancat
        size="xlarge"
        position={{ top: "20%", left: "-150px" }}
        animationName="nyancat-fly"
        animationDuration="18s"
        zIndex={1}
        isMotionActive={isMotionActive}
        testId="header-nyancat"
      />

      {/* Стили анимации — только transform; плавная синусоида по Y */}
      <style jsx>{`
        @keyframes nyancat-fly {
          0% {
            transform: translate3d(-150px, 0, 0);
          }
          10% {
            transform: translate3d(10vw, -28px, 0);
          }
          20% {
            transform: translate3d(20vw, -8px, 0);
          }
          30% {
            transform: translate3d(30vw, 24px, 0);
          }
          40% {
            transform: translate3d(40vw, 6px, 0);
          }
          50% {
            transform: translate3d(50vw, -24px, 0);
          }
          60% {
            transform: translate3d(60vw, -4px, 0);
          }
          70% {
            transform: translate3d(70vw, 28px, 0);
          }
          80% {
            transform: translate3d(80vw, 4px, 0);
          }
          90% {
            transform: translate3d(90vw, -20px, 0);
          }
          100% {
            transform: translate3d(calc(100vw + 150px), 0, 0);
          }
        }
      `}</style>
    </>
  );
};

export default HeaderNyancat;
