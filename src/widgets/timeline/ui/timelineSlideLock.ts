/** Mobile: date + copy share two rows across every slide. Desktop: one stacked cell. */
export const TIMELINE_SLIDES_GRID = "grid min-w-0 grid-rows-[auto_1fr] md:grid-rows-none";

export const TIMELINE_SLIDE_STACK =
  "col-start-1 row-start-1 row-span-2 grid min-w-0 grid-rows-subgrid md:row-span-1 md:grid-rows-none";

export const TIMELINE_BAND_GRID =
  "row-span-2 grid h-full min-h-0 min-w-0 grid-rows-subgrid md:row-span-1 md:grid-cols-[minmax(11rem,16rem)_1fr] md:grid-rows-none";

export const TIMELINE_TRACK_GRID = "grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto]";

export function timelineSlideClass(isActive: boolean): string {
  if (isActive) return `visible ${TIMELINE_SLIDE_STACK}`;
  return `invisible pointer-events-none ${TIMELINE_SLIDE_STACK}`;
}
