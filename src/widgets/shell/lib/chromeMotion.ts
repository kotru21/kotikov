export const CHROME_SLIDE_MS = 300;

export type ChromeSlideEdge = "top" | "bottom" | "left" | "right";

const HIDDEN: Record<ChromeSlideEdge, string> = {
  top: "-translate-y-full",
  bottom: "translate-y-full",
  left: "-translate-x-full",
  right: "translate-x-full",
};

const SHOWN: Record<ChromeSlideEdge, string> = {
  top: "translate-y-0",
  bottom: "translate-y-0",
  left: "translate-x-0",
  right: "translate-x-0",
};

export function chromeSlideClass(open: boolean, edge: ChromeSlideEdge, instant: boolean): string {
  const place = open ? SHOWN[edge] : HIDDEN[edge];
  if (instant) {
    return `transition-none ${place}`;
  }
  const ease = open ? "motion-safe:ease-out" : "motion-safe:ease-in";
  return `motion-safe:transition-transform motion-safe:duration-300 ${ease} ${place}`;
}
