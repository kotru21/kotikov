"use client";

import {
  type DominantEffect,
  resolveSceneMotion,
  type SceneMotionState,
} from "./model/sceneMotion";
import { useDocumentVisibility } from "./useDocumentVisibility";
import { usePerformanceSettings } from "./usePerformanceSettings";
import { type SceneIntersectionOptions, useSceneIntersection } from "./useSceneIntersection";

export interface UseSceneMotionPolicyOptions extends SceneIntersectionOptions {
  dominantEffect: DominantEffect;
}

export function useSceneMotionPolicy(
  sceneRef: React.RefObject<Element | null>,
  options: UseSceneMotionPolicyOptions
): SceneMotionState {
  const { reducedMotion, lowPerformance } = usePerformanceSettings();
  const isDocumentVisible = useDocumentVisibility();
  const isInView = useSceneIntersection(sceneRef, options);

  return resolveSceneMotion({
    reducedMotion,
    lowPerformance,
    isInView,
    isDocumentVisible,
    dominantEffect: options.dominantEffect,
  });
}
