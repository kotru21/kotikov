/**
 * Intent / telemetry label for the scene’s primary continuous effect.
 * `resolveSceneMotion` only special-cases `"none"` — other values do not gate independently.
 * Skills desktop uses `"marquee"` for both the marquee track and cursor nyancat.
 */
export type DominantEffect = "paint" | "flying-nyancat" | "marquee" | "cursor-nyancat" | "none";

export interface SceneMotionInput {
  reducedMotion: boolean;
  lowPerformance: boolean;
  isInView: boolean;
  isDocumentVisible: boolean;
  dominantEffect: DominantEffect;
}

export interface SceneMotionState extends SceneMotionInput {
  canRunContinuous: boolean;
}

export function resolveSceneMotion(input: SceneMotionInput): SceneMotionState {
  const canRunContinuous =
    !input.reducedMotion &&
    !input.lowPerformance &&
    input.isInView &&
    input.isDocumentVisible &&
    input.dominantEffect !== "none";

  return { ...input, canRunContinuous };
}
