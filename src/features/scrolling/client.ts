"use client";

/**
 * Client entry for scroll restoration and nav morph hooks.
 * Pure style helpers / utils: `@/features/scrolling`.
 */
export { ScrollRestoration } from "./ScrollRestoration";
export type { NavMorphPhase, NavMorphState } from "./useNavMorph";
export { computeNavMorph, lerp, useNavMorph } from "./useNavMorph";
