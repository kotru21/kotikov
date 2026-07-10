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
        bankAnimationName="nyancat-bank"
        testId="header-nyancat"
      />

      {/*
        Полёт разделён на два слоя, чтобы шлейф оставался ровным:
        - nyancat-fly: равномерное движение по X + плавная синусоида по Y (2.5 периода);
          та же анимация с задержкой формирует волну радужного хвоста.
        - nyancat-bank: крен и лёгкое «дыхание» масштаба только для самого кота —
          нос вверх на подъёме, вниз на спуске, ровно на пиках (совпадает по фазе с Y).
        Обе анимации 18s linear, поэтому кадрируются синхронно.
      */}
      <style jsx>{`
        @keyframes nyancat-fly {
          0% {
            transform: translate3d(-150px, 0, 0);
          }
          5% {
            transform: translate3d(5vw, -18px, 0);
          }
          10% {
            transform: translate3d(10vw, -26px, 0);
          }
          15% {
            transform: translate3d(15vw, -18px, 0);
          }
          20% {
            transform: translate3d(20vw, 0, 0);
          }
          25% {
            transform: translate3d(25vw, 18px, 0);
          }
          30% {
            transform: translate3d(30vw, 26px, 0);
          }
          35% {
            transform: translate3d(35vw, 18px, 0);
          }
          40% {
            transform: translate3d(40vw, 0, 0);
          }
          45% {
            transform: translate3d(45vw, -18px, 0);
          }
          50% {
            transform: translate3d(50vw, -26px, 0);
          }
          55% {
            transform: translate3d(55vw, -18px, 0);
          }
          60% {
            transform: translate3d(60vw, 0, 0);
          }
          65% {
            transform: translate3d(65vw, 18px, 0);
          }
          70% {
            transform: translate3d(70vw, 26px, 0);
          }
          75% {
            transform: translate3d(75vw, 18px, 0);
          }
          80% {
            transform: translate3d(80vw, 0, 0);
          }
          85% {
            transform: translate3d(85vw, -18px, 0);
          }
          90% {
            transform: translate3d(90vw, -26px, 0);
          }
          95% {
            transform: translate3d(95vw, -18px, 0);
          }
          100% {
            transform: translate3d(calc(100vw + 150px), 0, 0);
          }
        }

        @keyframes nyancat-bank {
          0% {
            transform: rotate(-7deg) scale(1);
          }
          5% {
            transform: rotate(-5deg) scale(0.986);
          }
          10% {
            transform: rotate(0deg) scale(0.98);
          }
          15% {
            transform: rotate(5deg) scale(0.986);
          }
          20% {
            transform: rotate(7deg) scale(1);
          }
          25% {
            transform: rotate(5deg) scale(1.014);
          }
          30% {
            transform: rotate(0deg) scale(1.02);
          }
          35% {
            transform: rotate(-5deg) scale(1.014);
          }
          40% {
            transform: rotate(-7deg) scale(1);
          }
          45% {
            transform: rotate(-5deg) scale(0.986);
          }
          50% {
            transform: rotate(0deg) scale(0.98);
          }
          55% {
            transform: rotate(5deg) scale(0.986);
          }
          60% {
            transform: rotate(7deg) scale(1);
          }
          65% {
            transform: rotate(5deg) scale(1.014);
          }
          70% {
            transform: rotate(0deg) scale(1.02);
          }
          75% {
            transform: rotate(-5deg) scale(1.014);
          }
          80% {
            transform: rotate(-7deg) scale(1);
          }
          85% {
            transform: rotate(-5deg) scale(0.986);
          }
          90% {
            transform: rotate(0deg) scale(0.98);
          }
          95% {
            transform: rotate(5deg) scale(0.986);
          }
          100% {
            transform: rotate(7deg) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default HeaderNyancat;
