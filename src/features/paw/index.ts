/**
 * Paw feature public API.
 *
 * - `usePawAnimation`: shared paint pointer hook (header + contacts).
 * - `PaintDrawHint`, `ClearPaintButton`, `PawCursorIcon`: contacts UI surfaces
 *   (Stage 7 ownership; kept here as the paint feature public kit).
 *
 * Intentional couplings: `device` (PaintDrawHint mobile copy),
 * `interactive-elements` (paint-aware hint wrapping). Stage 9 may extract shared primitives.
 */
export { ClearPaintButton } from "./ui/ClearPaintButton";
export { PaintDrawHint } from "./ui/PaintDrawHint";
export { PawCursorIcon } from "./ui/PawCursorIcon";
export { usePawAnimation } from "./usePawAnimation";
