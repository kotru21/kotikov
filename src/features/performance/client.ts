"use client";

/**
 * Client entry for performance / motion hooks.
 * Pure scene-motion resolver: `@/features/performance`.
 */
export { useDocumentVisibility } from "./useDocumentVisibility";
export { usePerformanceSettings } from "./usePerformanceSettings";
export { useRafWhile } from "./useRafWhile";
export { type SceneIntersectionOptions, useSceneIntersection } from "./useSceneIntersection";
export { useSceneMotionPolicy, type UseSceneMotionPolicyOptions } from "./useSceneMotionPolicy";
