export type DeckCardRole = "active" | "next" | "prev" | "hidden";

export interface DeckTransform {
  zIndex: number;
  transform: string;
  opacity: number;
  isActive: boolean;
}

export const DECK_MOTION_CLASS = "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Cyclic deck roles for the projects carousel.
 * With `count === 3` this yields one active, one next, one prev (unchanged UX).
 * With `count > 3`, non-adjacent cards are `hidden` so they do not stack as `prev`.
 */
export function getCyclicDeckCardRole(
  cardIndex: number,
  activeIndex: number,
  count: number
): DeckCardRole {
  if (count <= 0) return "hidden";
  if (cardIndex === activeIndex) return "active";

  const nextIndex = (activeIndex + 1) % count;
  if (cardIndex === nextIndex) return "next";

  const prevIndex = (activeIndex - 1 + count) % count;
  if (cardIndex === prevIndex) return "prev";

  return "hidden";
}

export function getLinearDeckCardRole(cardIndex: number, activeIndex: number): DeckCardRole {
  if (cardIndex === activeIndex) return "active";
  if (cardIndex === activeIndex + 1) return "next";
  if (cardIndex === activeIndex - 1) return "prev";
  return "hidden";
}

export function getWrappedIndex(current: number, delta: number, count: number): number {
  if (count <= 0) return 0;
  return (current + delta + count) % count;
}

export function getDeckTransform(role: DeckCardRole, reducedMotion: boolean): DeckTransform {
  if (reducedMotion) {
    if (role === "active") {
      return { zIndex: 30, transform: "none", opacity: 1, isActive: true };
    }

    if (role === "hidden") {
      return { zIndex: 0, transform: "none", opacity: 0, isActive: false };
    }

    return { zIndex: 10, transform: "none", opacity: 0.55, isActive: false };
  }

  switch (role) {
    case "active":
      return {
        zIndex: 30,
        transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)",
        opacity: 1,
        isActive: true,
      };
    case "next":
      return {
        zIndex: 20,
        transform: "translate3d(10px, 12px, 0) scale(0.97) rotate(2.5deg)",
        opacity: 0.95,
        isActive: false,
      };
    case "prev":
      return {
        zIndex: 10,
        transform: "translate3d(-10px, 22px, 0) scale(0.94) rotate(-2.5deg)",
        opacity: 0.9,
        isActive: false,
      };
    case "hidden":
      return {
        zIndex: 0,
        transform: "translate3d(0, 28px, 0) scale(0.92) rotate(0deg)",
        opacity: 0,
        isActive: false,
      };
  }
}
