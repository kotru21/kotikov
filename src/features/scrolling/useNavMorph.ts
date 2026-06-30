"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { usePerformanceSettings } from "@/features/performance";

const PHASE1_END = 40;
const PHASE2_END = 120;
const PHASE1_PROGRESS = 0.4;
const REDUCED_MOTION_THRESHOLD = 60;

export type NavMorphPhase = 0 | 1 | 2;

export interface NavMorphState {
  progress: number;
  phase: NavMorphPhase;
  isIsland: boolean;
}

export const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

export const computeNavMorph = (scrollY: number, snapMorph = false): NavMorphState => {
  if (scrollY <= 0) {
    return { progress: 0, phase: 0, isIsland: false };
  }

  if (snapMorph) {
    const isIsland = scrollY > REDUCED_MOTION_THRESHOLD;
    return { progress: isIsland ? 1 : 0, phase: isIsland ? 2 : 0, isIsland };
  }

  if (scrollY <= PHASE1_END) {
    const progress = (scrollY / PHASE1_END) * PHASE1_PROGRESS;
    return { progress, phase: 1, isIsland: false };
  }

  if (scrollY <= PHASE2_END) {
    const progress =
      PHASE1_PROGRESS +
      ((scrollY - PHASE1_END) / (PHASE2_END - PHASE1_END)) * (1 - PHASE1_PROGRESS);
    return { progress, phase: 2, isIsland: progress >= 0.95 };
  }

  return { progress: 1, phase: 2, isIsland: true };
};

export const useNavMorph = (): NavMorphState => {
  const { reducedMotion, lowPerformance } = usePerformanceSettings();
  const snapMorph = reducedMotion || lowPerformance;

  const [state, setState] = useState<NavMorphState>({
    progress: 0,
    phase: 0,
    isIsland: false,
  });
  const rafRef = useRef<number | null>(null);
  const snapMorphRef = useRef(snapMorph);
  snapMorphRef.current = snapMorph;

  useLayoutEffect(() => {
    setState(computeNavMorph(window.scrollY, snapMorphRef.current));
  }, []);

  useEffect(() => {
    const update = (): void => {
      setState(computeNavMorph(window.scrollY, snapMorphRef.current));
    };

    const onScroll = (): void => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        update();
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [snapMorph]);

  return state;
};
