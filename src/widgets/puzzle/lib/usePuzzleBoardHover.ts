import { useState } from "react";

import type { PuzzleBoardArea } from "./puzzleBoardTracks";

export interface PuzzleBoardPointer {
  pointerType: string;
  relatedTarget: EventTarget | null;
}

export interface PuzzleBoardHover {
  hoverArea: PuzzleBoardArea | null;
  onCellPointerEnter: (event: PuzzleBoardPointer, area: PuzzleBoardArea) => void;
  onCellPointerLeave: (event: PuzzleBoardPointer) => void;
}

function ignoreHover(reducedMotion: boolean, pointerType: string): boolean {
  return reducedMotion || pointerType === "touch";
}

export function usePuzzleBoardHover(reducedMotion: boolean): PuzzleBoardHover {
  const [hoverArea, setHoverArea] = useState<PuzzleBoardArea | null>(null);

  const onCellPointerEnter = (event: PuzzleBoardPointer, area: PuzzleBoardArea): void => {
    if (ignoreHover(reducedMotion, event.pointerType)) return;
    setHoverArea(area);
  };

  const onCellPointerLeave = (event: PuzzleBoardPointer): void => {
    if (ignoreHover(reducedMotion, event.pointerType)) return;
    const next = event.relatedTarget;
    if (next instanceof Element && next.closest("[data-area]")) return;
    setHoverArea(null);
  };

  return {
    hoverArea: reducedMotion ? null : hoverArea,
    onCellPointerEnter,
    onCellPointerLeave,
  };
}
