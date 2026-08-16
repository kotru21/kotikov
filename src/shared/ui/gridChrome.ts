export const GRID_STROKE_COLOR = "border-[#111] dark:border-[#ededed]";
export const GRID_STROKE = `border-2 ${GRID_STROKE_COLOR}`;
export const GRID_INK = "bg-[#111] dark:bg-[#ededed]";
export const GRID_GAP = `gap-[2px] ${GRID_INK}`;
/** Shared 2px rule between stacked bands — not a second `border-2` box. */
export const GRID_DIVIDE = "divide-y-2 divide-[#111] dark:divide-[#ededed]";
/** Shared 2px rule between cells in a row (chrome, about columns). */
export const GRID_DIVIDE_X = "divide-x-2 divide-[#111] dark:divide-[#ededed]";
/** Horizontal-only content stack: top/bottom rules + divides, no left/right. */
export const GRID_BAND_STACK = `-mt-[2px] border-t-2 max-md:border-b-2 ${GRID_STROKE_COLOR} ${GRID_DIVIDE}`;
/** One horizontal rule under a heading; no side strokes. */
export const GRID_RULE_TOP = `border-t-2 ${GRID_STROKE_COLOR}`;
/** One horizontal rule above the next band; no side strokes. */
export const GRID_RULE_BOTTOM = `border-b-2 ${GRID_STROKE_COLOR}`;
/** Puzzle: full-bleed cell sitting on the band above — keep sides + bottom, drop the extra top. */
export const GRID_STROKE_OMIT_TOP = `border-x-2 border-b-2 ${GRID_STROKE_COLOR}`;
/** Puzzle: full-bleed cell sitting on the band below — keep sides + top, drop the extra bottom. */
export const GRID_STROKE_OMIT_BOTTOM = `border-x-2 border-t-2 ${GRID_STROKE_COLOR}`;
/** Content band: no vertical outer strokes; horizontals come from the stack. */
export const GRID_STROKE_OMIT_Y = "border-0";
/** Puzzle neighbor flush to K on the left: keep Y + right, drop the extra left. */
export const GRID_STROKE_OMIT_LEFT = `border-y-2 border-r-2 ${GRID_STROKE_COLOR}`;
/** Puzzle neighbor flush to K on the right: keep Y + left, drop the extra right. */
export const GRID_STROKE_OMIT_RIGHT = `border-y-2 border-l-2 ${GRID_STROKE_COLOR}`;
/** Light ink on paper / dark ink on #0a0a0a — use on copy that must not keep light-only tokens. */
export const GRID_TYPE = "text-[#111] dark:text-[#ededed]";
export const GRID_SURFACE = `bg-background-primary dark:bg-background-dark ${GRID_TYPE}`;
export const TEAL_FILL = "bg-primary-500 text-[#111]";
export const CELL_HOVER = "hover:bg-primary-500 hover:text-[#111]";
export const GIANT_LABEL =
  "font-black uppercase tracking-[-0.05em] text-[clamp(1.5rem,4vw,2.75rem)]";

/** Horizontal-only stroke for a cell in a 1-D stack (no left/right). */
export function gridStrokeForBand(index: number, total: number): string {
  const first = index === 0;
  const last = index === total - 1;
  if (first && last) return GRID_STROKE_OMIT_Y;
  if (first) return GRID_RULE_BOTTOM;
  return GRID_RULE_TOP;
}
