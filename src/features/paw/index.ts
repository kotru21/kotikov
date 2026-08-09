/**
 * Paw feature public API.
 *
 * - `usePawAnimation`: shared paint pointer hook (header + contacts).
 * - `PaintDrawHint`, `ClearPaintButton`: contacts paint chrome.
 *
 * Intentional couplings: `device` (PaintDrawHint mobile copy),
 * `interactive-elements` (paint-aware hint wrapping). Stage 9 may extract shared primitives.
 */
export { ClearPaintButton } from "./ui/ClearPaintButton";
export { PaintDrawHint } from "./ui/PaintDrawHint";
export { usePawAnimation } from "./usePawAnimation";
