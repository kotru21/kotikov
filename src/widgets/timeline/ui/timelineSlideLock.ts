/** Mobile: date + copy share two content rows. Desktop: one stacked cell. Never use row-span — it resets row-start. */
export const TIMELINE_SLIDES_GRID = "grid min-w-0 max-md:grid-rows-[auto_auto]";

export const TIMELINE_SLIDE_STACK =
  "col-start-1 row-start-1 row-end-2 grid min-w-0 max-md:row-end-3 max-md:grid-rows-subgrid";

export const TIMELINE_BAND_GRID =
  "grid h-full min-h-0 min-w-0 max-md:grid-rows-subgrid md:grid-cols-[minmax(11rem,16rem)_1fr]";

export const TIMELINE_TRACK_GRID = "grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto]";

export function timelineSlideClass(isActive: boolean): string {
  if (isActive) return `visible ${TIMELINE_SLIDE_STACK}`;
  return `invisible pointer-events-none ${TIMELINE_SLIDE_STACK}`;
}
