/**
 * Intentional feature couplings (Stage 2 review):
 * - device: mobile vs desktop pointer / trail interaction
 * - performance: reduced-motion and low-perf explosion pruning
 * Broader shared-primitive extraction is deferred to Stage 9.
 *
 * Server-safe exports only. Client components/hooks: `@/features/nyancat/client`.
 */
export * from "./lib/constants";
export * from "./lib/keyframes";
export * from "./lib/utils";
export type * from "./types";
