export const isInteractiveTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) return false;

  // Явный opt-out для рисования
  if (target.closest("[data-draw-exclude]")) return true;

  // Базовые интерактивные элементы
  return Boolean(
    target.closest(
      "a,button,input,textarea,select,label,[role='button'],[role='link']"
    )
  );
};
