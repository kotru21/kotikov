import { type RefObject, useCallback, useRef } from "react";

export interface RevealedPaintEntry {
  color: string;
  intensity: number;
}

interface UseContactPaintStateReturn {
  revealedMapRef: RefObject<Map<string, RevealedPaintEntry>>;
  clearPaint: () => void;
}

/** Owns revealed brush strokes separately from cat silhouette generation. */
export function useContactPaintState(): UseContactPaintStateReturn {
  const revealedMapRef = useRef(new Map<string, RevealedPaintEntry>());

  const clearPaint = useCallback((): void => {
    revealedMapRef.current.clear();
  }, []);

  return { revealedMapRef, clearPaint };
}
