import { type PuzzleCellId, puzzleCells, puzzleTickers } from "@/shared/config/content";
import { GRID_GAP, GRID_STROKE, TEAL_FILL } from "@/shared/ui/gridChrome";
import { KMark } from "@/shared/ui/KMark";
import { MarqueeTicker } from "@/shared/ui/MarqueeTicker";

import { PuzzleCellLink } from "./PuzzleCellLink";

const MOBILE_CELL_ORDER: readonly PuzzleCellId[] = ["about", "projects", "experience", "contacts"];

const MOBILE_PUZZLE_CELLS = MOBILE_CELL_ORDER.flatMap((id) =>
  puzzleCells.filter((cell) => cell.id === id)
);

export function PuzzleMobile(): React.JSX.Element {
  return (
    <div className={`flex h-full min-h-0 flex-col overflow-hidden ${GRID_GAP} ${GRID_STROKE} md:hidden`}>
      <MarqueeTicker text={puzzleTickers.top} />
      <div className={`flex min-h-12 items-center justify-center ${TEAL_FILL}`}>
        <KMark className="h-8 w-auto text-[#111]" />
      </div>
      <div className={`flex flex-1 flex-col ${GRID_GAP}`} data-puzzle="mobile">
        {MOBILE_PUZZLE_CELLS.map((cell) => (
          <PuzzleCellLink key={cell.id} cell={cell} className="flex-1" />
        ))}
      </div>
      <MarqueeTicker href="#skills" text={puzzleTickers.bottom} />
    </div>
  );
}
