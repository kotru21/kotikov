export const CHROME_SLIDE_MS = 300;

export type ChromeSlideEdge = "left" | "right" | "bottom";

const HIDDEN: Record<ChromeSlideEdge, string> = {
  left: "-translate-x-full",
  right: "translate-x-full",
  bottom: "translate-y-full",
};

const SHOWN: Record<ChromeSlideEdge, string> = {
  left: "translate-x-0",
  right: "translate-x-0",
  bottom: "translate-y-0",
};

export function chromeSlideClass(open: boolean, edge: ChromeSlideEdge, instant: boolean): string {
  const place = open ? SHOWN[edge] : HIDDEN[edge];
  if (instant) {
    return `transition-none ${place}`;
  }
  const ease = open ? "motion-safe:ease-out" : "motion-safe:ease-in";
  return `motion-safe:transition-transform motion-safe:duration-300 ${ease} ${place}`;
}
