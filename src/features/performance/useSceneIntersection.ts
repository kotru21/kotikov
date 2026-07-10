"use client";

import { useEffect, useState } from "react";

export interface SceneIntersectionOptions {
  rootMargin?: string;
  threshold?: number | number[];
}

export function useSceneIntersection(
  sceneRef: React.RefObject<Element | null>,
  { rootMargin = "0px", threshold = 0.15 }: SceneIntersectionOptions
): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    if (scene === null) return;

    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      rootMargin,
      threshold,
    });
    observer.observe(scene);
    return () => observer.disconnect();
  }, [rootMargin, sceneRef, threshold]);

  return isInView;
}
