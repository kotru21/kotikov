const NATIVE_INTERACTIVE_SELECTOR =
  "a,button,input,textarea,select,label,[role='button'],[role='link'],[role='tab']";

/** Native activatable controls (links/buttons/inputs). Used to preserve touch clicks. */
export function isActivatableControl(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest(NATIVE_INTERACTIVE_SELECTOR));
}

export const isInteractiveTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) return false;

  // Явный opt-out для рисования (элемент помечен как исключение)
  if (target.closest("[data-draw-exclude]")) return true;

  // Opt-in paint targets: drawing is allowed even on buttons/links so paint can
  // continue under/around cards that also react via collision styling (mouse path).
  // Touch path must still skip activatable controls — see usePawAnimation.
  if (target.closest("[data-draw-allow]")) return false;

  // Кнопки и ссылки без opt-in блокируют рисование (клик важнее следа)
  if (isActivatableControl(target)) return true;

  return false;
};
