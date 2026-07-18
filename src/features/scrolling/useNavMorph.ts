"use client";

import { useSyncExternalStore } from "react";

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

const SERVER_SNAPSHOT: NavMorphState = { progress: 0, phase: 0, isIsland: false };

/** Module cache so useSyncExternalStore getSnapshot stays Object.is-stable. */
let navMorphCache: { scrollY: number; snapMorph: boolean; state: NavMorphState } = {
  scrollY: Number.NaN,
  snapMorph: false,
  state: SERVER_SNAPSHOT,
};

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

function getNavMorphSnapshot(snapMorph: boolean): NavMorphState {
  const scrollY = window.scrollY;
  if (scrollY === navMorphCache.scrollY && snapMorph === navMorphCache.snapMorph) {
    return navMorphCache.state;
  }
  const state = computeNavMorph(scrollY, snapMorph);
  navMorphCache = { scrollY, snapMorph, state };
  return state;
}

function subscribeNavMorph(onStoreChange: () => void): () => void {
  let raf: number | null = null;
  const onScroll = (): void => {
    if (raf !== null) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      onStoreChange();
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", onScroll);
    if (raf !== null) {
      cancelAnimationFrame(raf);
    }
  };
}

export const useNavMorph = (): NavMorphState => {
  const { reducedMotion, lowPerformance } = usePerformanceSettings();
  const snapMorph = reducedMotion || lowPerformance;

  return useSyncExternalStore(
    subscribeNavMorph,
    () => getNavMorphSnapshot(snapMorph),
    () => SERVER_SNAPSHOT
  );
};
