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
