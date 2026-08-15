"use client";

import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

export const PUZZLE_CHROME_THRESHOLDS = [0, 1] as const;

const PUZZLE_OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: [...PUZZLE_CHROME_THRESHOLDS],
};

const ChromeVisibleContext = createContext(false);

function subscribeNever(): () => void {
  return () => undefined;
}

interface PuzzleChromeEntry {
  isIntersecting: boolean;
  boundingClientRect: Pick<DOMRectReadOnly, "bottom">;
}

/** Show chrome after the puzzle bottom leaves the viewport; hide while any puzzle remains. */
export function shouldShowChrome(entry: PuzzleChromeEntry): boolean {
  return !entry.isIntersecting || entry.boundingClientRect.bottom <= 0;
}

/** True when site chrome is in tab order (puzzle must not also expose theme). */
export function useChromeVisibleState(): boolean {
  return useContext(ChromeVisibleContext);
}

export function ChromeVisibleProvider({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}): React.JSX.Element {
  return createElement(ChromeVisibleContext, { value: open }, children);
}

export function useChromeVisible(puzzleRef: React.RefObject<Element | null>): boolean {
  const isClient = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  );
  const [puzzleCovering, setPuzzleCovering] = useState(true);

  useEffect(() => {
    const puzzle = puzzleRef.current;
    if (puzzle === null) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setPuzzleCovering(!shouldShowChrome(entry));
    }, PUZZLE_OBSERVER_OPTIONS);

    observer.observe(puzzle);
    return () => observer.disconnect();
  }, [puzzleRef]);

  return isClient && !puzzleCovering;
}
