"use client";

import { usePerformanceSettings } from "@/features/performance/client";
import { puzzleCells, puzzleTickers } from "@/shared/config/content";
import {
  GRID_STROKE,
  GRID_STROKE_OMIT_BOTTOM,
  GRID_STROKE_OMIT_LEFT,
  GRID_STROKE_OMIT_RIGHT,
  GRID_STROKE_OMIT_TOP,
  TEAL_FILL,
} from "@/shared/ui/gridChrome";
import { KMark } from "@/shared/ui/KMark";
import { MarqueeTicker } from "@/shared/ui/MarqueeTicker";

import { puzzleBoardTracks } from "../lib/puzzleBoardTracks";
import { type PuzzleBoardHover, usePuzzleBoardHover } from "../lib/usePuzzleBoardHover";
import { PuzzleCellLink } from "./PuzzleCellLink";
import { PuzzleThemeToggle } from "./PuzzleThemeToggle";

const PUZZLE_AREA_CLASS = {
  about: `col-start-1 col-end-3 row-start-1 z-[1] ${GRID_STROKE_OMIT_BOTTOM}`,
  contacts: `col-start-3 row-start-1 row-end-3 z-[1] ${GRID_STROKE_OMIT_LEFT}`,
  projects: `col-start-1 row-start-2 row-end-4 z-[1] ${GRID_STROKE_OMIT_RIGHT}`,
  experience: `col-start-2 col-end-4 row-start-3 z-[1] ${GRID_STROKE_OMIT_TOP}`,
} as const;

const BOARD_MOTION_CLASS =
  "transition-[grid-template-columns,grid-template-rows] duration-300 ease-out motion-reduce:transition-none";

const TICKER_PLACE = {
  left: `${GRID_STROKE} z-[1] col-start-1 row-span-full`,
  right: `${GRID_STROKE} z-[3] col-start-3 row-span-full`,
  top: `${GRID_STROKE} z-[4] col-span-full row-start-1`,
  bottom: `${GRID_STROKE} z-[2] col-span-full row-start-3`,
} as const;

interface PuzzleBoardPointerHandlers {
  onEnter: PuzzleBoardHover["onCellPointerEnter"];
  onLeave: PuzzleBoardHover["onCellPointerLeave"];
}

function PuzzleLogoCell({ onEnter, onLeave }: PuzzleBoardPointerHandlers): React.JSX.Element {
  return (
    <div
      className={`z-10 col-start-2 row-start-2 m-0 box-border flex min-h-0 min-w-0 flex-col items-center justify-center gap-2 ${GRID_STROKE} ${TEAL_FILL}`}
      data-area="k"
      onPointerEnter={(event) => onEnter(event, "k")}
      onPointerLeave={onLeave}
    >
      <KMark className="h-auto w-[32%] text-[#111]" />
      <PuzzleThemeToggle className="size-8" />
    </div>
  );
}

function PuzzleBoardLinks({ onEnter, onLeave }: PuzzleBoardPointerHandlers): React.JSX.Element[] {
  return puzzleCells.map((cell) => (
    <PuzzleCellLink
      key={cell.id}
      cell={cell}
      className={PUZZLE_AREA_CLASS[cell.area]}
      onPointerEnter={(event) => onEnter(event, cell.area)}
      onPointerLeave={onLeave}
    />
  ));
}

function PuzzleBoard(): React.JSX.Element {
  const { reducedMotion } = usePerformanceSettings();
  const { hoverArea, onCellPointerEnter, onCellPointerLeave } = usePuzzleBoardHover(reducedMotion);
  const tracks = puzzleBoardTracks(hoverArea);

  return (
    <div
      className={`relative z-0 col-start-2 row-start-2 -m-[2px] box-border grid min-h-0 min-w-0 overflow-hidden ${BOARD_MOTION_CLASS}`}
      data-hover={hoverArea ?? "rest"}
      data-puzzle="desktop"
      style={{ gridTemplateColumns: tracks.columns, gridTemplateRows: tracks.rows }}
    >
      <PuzzleBoardLinks onEnter={onCellPointerEnter} onLeave={onCellPointerLeave} />
      <PuzzleLogoCell onEnter={onCellPointerEnter} onLeave={onCellPointerLeave} />
    </div>
  );
}

export function PuzzleDesktop(): React.JSX.Element {
  return (
    <div
      className="relative isolate box-border grid h-dvh max-h-dvh min-h-0 grid-cols-[2.4rem_minmax(0,1fr)_2.4rem] grid-rows-[2.1rem_minmax(0,1fr)_2.1rem] overflow-hidden max-md:hidden"
    >
      <PuzzleBoard />
      <MarqueeTicker className={TICKER_PLACE.left} orientation="vertical" text={puzzleTickers.left} />
      <MarqueeTicker className={TICKER_PLACE.right} orientation="vertical" text={puzzleTickers.right} />
      <MarqueeTicker className={TICKER_PLACE.top} text={puzzleTickers.top} />
      <MarqueeTicker className={TICKER_PLACE.bottom} href="#skills" text={puzzleTickers.bottom} />
    </div>
  );
}
