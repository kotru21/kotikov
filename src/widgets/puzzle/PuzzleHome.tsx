import { GRID_SURFACE } from "@/shared/ui/gridChrome";

import { PuzzleMobile } from "./ui/PuzzleMobile";
import { PuzzleViews } from "./ui/PuzzleViews";

export function PuzzleHome(): React.JSX.Element {
  return (
    <header className={`${GRID_SURFACE} min-h-dvh md:h-dvh md:max-h-dvh md:overflow-hidden`} id="header">
      <h1 className="sr-only">Kotikov</h1>
      <PuzzleViews mobile={<PuzzleMobile />} />
    </header>
  );
}
