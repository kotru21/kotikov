export const isInteractiveTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) return false;

  // Явный opt-out для рисования (элемент помечен как исключение)
  if (target.closest("[data-draw-exclude]")) return true;

  // Кнопки и ссылки всегда интерактивны, даже если участвуют в paint-эффекте
  const isNativeInteractive = Boolean(
    target.closest(
      "a,button,input,textarea,select,label,[role='button'],[role='link'],[role='tab']"
    )
  );
  if (isNativeInteractive) return true;

  // Декоративные paint-мишени (div и т.п.) — рисование поверх них допустимо
  if (target.closest("[data-draw-allow]")) return false;

  return false;
};
