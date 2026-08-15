import type { PointerEvent } from "react";

import type { PuzzleCell } from "@/shared/config/content";
import { CELL_HOVER, GIANT_LABEL, GRID_SURFACE } from "@/shared/ui/gridChrome";

interface PuzzleCellLinkProps {
  cell: PuzzleCell;
  className?: string;
  onPointerEnter?: (event: PointerEvent<HTMLAnchorElement>) => void;
  onPointerLeave?: (event: PointerEvent<HTMLAnchorElement>) => void;
}

const CELL_INTERACTION = `cursor-pointer ${CELL_HOVER} focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#111] dark:focus-visible:ring-[#ededed]`;

export function PuzzleCellLink({
  cell,
  className = "",
  onPointerEnter,
  onPointerLeave,
}: PuzzleCellLinkProps): React.JSX.Element {
  return (
    <a
      className={`box-border flex min-h-0 min-w-0 items-center justify-center no-underline ${GIANT_LABEL} ${GRID_SURFACE} ${CELL_INTERACTION} ${className}`}
      data-area={cell.area}
      href={cell.href}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {cell.label}
    </a>
  );
}
