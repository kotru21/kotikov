import type { PuzzleCell } from "@/shared/config/content";

export type PuzzleBoardArea = PuzzleCell["area"] | "k";

export interface PuzzleBoardTracks {
  columns: string;
  rows: string;
}

const CENTER_TRACK = 20;
/** Rest 40/20/40 → hover K 32/36/32: +16 on the middle, outer tracks shrink equally. */
const K_HOVER_TRIPLE = [32, 36, 32] as const;

function percentTrack(value: number): string {
  return `minmax(0,${value.toString()}%)`;
}

/** start + center + end must equal 100. */
function trackTriple(start: number, center: number, end: number): string {
  return `${percentTrack(start)} ${percentTrack(center)} ${percentTrack(end)}`;
}

function boardTracks(
  columns: readonly [number, number, number],
  rows: readonly [number, number, number]
): PuzzleBoardTracks {
  return {
    columns: trackTriple(columns[0], columns[1], columns[2]),
    rows: trackTriple(rows[0], rows[1], rows[2]),
  };
}

/** Rest tracks: 40/20/40. Outer-cell hover keeps the 20% center; K hover grows it. */
export const PUZZLE_BOARD_REST_TRACKS: PuzzleBoardTracks = boardTracks(
  [40, CENTER_TRACK, 40],
  [40, CENTER_TRACK, 40]
);

const PUZZLE_BOARD_HOVER_TRACKS: Record<PuzzleBoardArea, PuzzleBoardTracks> = {
  about: boardTracks([50, CENTER_TRACK, 30], [50, CENTER_TRACK, 30]),
  contacts: boardTracks([24, CENTER_TRACK, 56], [52, CENTER_TRACK, 28]),
  projects: boardTracks([55, CENTER_TRACK, 25], [40, CENTER_TRACK, 40]),
  // experience cell spans center+right (20 + end); end is 44 so the cell is 64 wide.
  experience: boardTracks([36, CENTER_TRACK, 44], [24, CENTER_TRACK, 56]),
  k: boardTracks(K_HOVER_TRIPLE, K_HOVER_TRIPLE),
};

export function puzzleBoardTracks(area: PuzzleBoardArea | null): PuzzleBoardTracks {
  if (area === null) {
    return PUZZLE_BOARD_REST_TRACKS;
  }
  return PUZZLE_BOARD_HOVER_TRACKS[area];
}
