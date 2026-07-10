export const isInteractiveTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) return false;

  // Явный opt-out для рисования (элемент помечен как исключение)
  if (target.closest("[data-draw-exclude]")) return true;

  // Opt-in paint targets: drawing is allowed even on buttons/links so paint can
  // continue under/around cards that also react via collision styling.
  if (target.closest("[data-draw-allow]")) return false;

  // Кнопки и ссылки без opt-in блокируют рисование (клик важнее следа)
  const isNativeInteractive = Boolean(
    target.closest(
      "a,button,input,textarea,select,label,[role='button'],[role='link'],[role='tab']"
    )
  );
  if (isNativeInteractive) return true;

  return false;
};
