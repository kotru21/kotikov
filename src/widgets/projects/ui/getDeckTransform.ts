export type DeckCardRole = "active" | "next" | "prev";

export interface DeckTransform {
  zIndex: number;
  transform: string;
  opacity: number;
  isActive: boolean;
}

export function getDeckCardRole(
  cardIndex: number,
  activeIndex: number,
  count: number
): DeckCardRole {
  if (cardIndex === activeIndex) return "active";

  const nextIndex = (activeIndex + 1) % count;
  if (cardIndex === nextIndex) return "next";

  return "prev";
}

export function getWrappedIndex(current: number, delta: number, count: number): number {
  return (current + delta + count) % count;
}

export function getDeckTransform(role: DeckCardRole, reducedMotion: boolean): DeckTransform {
  if (reducedMotion) {
    if (role === "active") {
      return { zIndex: 30, transform: "none", opacity: 1, isActive: true };
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
  }
}
