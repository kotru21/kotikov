"use client";

import React from "react";

import { FlyingNyancat } from "@/features/nyancat";

interface HeaderNyancatProps {
  isMotionActive: boolean;
}

const WAVE_CYCLES = 2.5;
const Y_AMPLITUDE = 26;
const BANK_DEG = 7;
const SCALE_AMPLITUDE = 0.02;
const KEYFRAME_STEP = 5;

function roundCss(value: number, digits = 3): string {
  const factor = 10 ** digits;
  const rounded = Math.round(value * factor) / factor;
  return String(rounded);
}

function buildNyancatKeyframes(): string {
  const flyFrames: string[] = [];
  const bankFrames: string[] = [];

  for (let percent = 0; percent <= 100; percent += KEYFRAME_STEP) {
    const t = percent / 100;
    const phase = t * WAVE_CYCLES * Math.PI * 2;
    const y = -Y_AMPLITUDE * Math.sin(phase);
    const rotate = -BANK_DEG * Math.cos(phase);
    const scale = 1 - SCALE_AMPLITUDE * Math.sin(phase);
    const x =
      percent === 0
        ? "-150px"
        : percent === 100
          ? "calc(100vw + 150px)"
          : `${String(percent)}vw`;

    flyFrames.push(`
          ${String(percent)}% {
            transform: translate3d(${x}, ${roundCss(y, 0)}px, 0);
          }`);
    bankFrames.push(`
          ${String(percent)}% {
            transform: rotate(${roundCss(rotate, 0)}deg) scale(${roundCss(scale)});
          }`);
  }

  return `
        @keyframes nyancat-fly {${flyFrames.join("")}
        }

        @keyframes nyancat-bank {${bankFrames.join("")}
        }
  `;
}

const nyancatKeyframesCss = buildNyancatKeyframes();

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
      <style dangerouslySetInnerHTML={{ __html: nyancatKeyframesCss }} />
    </>
  );
};

export default HeaderNyancat;
