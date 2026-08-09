/**
 * Server-safe scrolling helpers.
 * Client hooks/components: `@/features/scrolling/client`.
 */
export type { NavIslandComputedStyle, NavIslandPreset } from "./navIslandStyle";
export {
  computeNavIslandStyle,
  DESKTOP_NAV_ISLAND_PRESET,
  MOBILE_NAV_ISLAND_PRESET,
} from "./navIslandStyle";
export { shouldResetScrollOnLoad } from "./scrollUtils";
