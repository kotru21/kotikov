"use client";

import { useEffect, useState } from "react";

export type ActiveSectionId = "about" | "projects" | "skills" | "experience" | "contacts" | null;

export const ACTIVE_SECTION_THRESHOLDS = [0, 0.25, 0.5, 0.75, 1] as const;

export const DESKTOP_CHROME_ROOT_MARGIN = "0px 0px -56px 0px";
/** Inset by mobile title bar (h-12 = 48px) and bottom nav (h-14 = 56px). IO only accepts px/%. */
export const MOBILE_CHROME_ROOT_MARGIN = "-48px 0px -56px 0px";

export const ACTIVE_SECTION_OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: [...ACTIVE_SECTION_THRESHOLDS],
  rootMargin: DESKTOP_CHROME_ROOT_MARGIN,
};

function isDesktopViewport(): boolean {
  if (typeof window.matchMedia !== "function") {
    return true;
  }
  return window.matchMedia("(min-width: 768px)").matches;
}

function observerOptionsForViewport(): IntersectionObserverInit {
  return {
    threshold: [...ACTIVE_SECTION_THRESHOLDS],
    rootMargin: isDesktopViewport() ? DESKTOP_CHROME_ROOT_MARGIN : MOBILE_CHROME_ROOT_MARGIN,
  };
}

const KNOWN_SECTION_IDS = new Set<string>([
  "about",
  "projects",
  "skills",
  "experience",
  "contacts",
]);

function asActiveSectionId(id: string): Exclude<ActiveSectionId, null> | null {
  if (!KNOWN_SECTION_IDS.has(id)) {
    return null;
  }
  return id as Exclude<ActiveSectionId, null>;
}

function pickActive(ratios: Map<Element, number>): ActiveSectionId {
  let best: Element | null = null;
  let bestRatio = 0;
  for (const [el, ratio] of ratios) {
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = el;
    }
  }
  if (best === null) {
    return null;
  }
  return asActiveSectionId(best.id);
}

function elementsForIds(ids: readonly string[]): HTMLElement[] {
  const found: HTMLElement[] = [];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el !== null) {
      found.push(el);
    }
  }
  return found;
}

function recordRatios(entries: IntersectionObserverEntry[], ratios: Map<Element, number>): void {
  for (const entry of entries) {
    ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
  }
}

function observeSections(
  ids: readonly string[],
  onActive: (id: ActiveSectionId) => void
): () => void {
  const elements = elementsForIds(ids);
  if (elements.length === 0) {
    return () => undefined;
  }

  const ratios = new Map<Element, number>();
  const observer = new IntersectionObserver((entries) => {
    recordRatios(entries, ratios);
    onActive(pickActive(ratios));
  }, observerOptionsForViewport());

  for (const el of elements) {
    observer.observe(el);
  }
  return () => observer.disconnect();
}

export function useActiveSection(ids: readonly string[]): ActiveSectionId {
  const [active, setActive] = useState<ActiveSectionId>(null);

  useEffect(() => observeSections(ids, setActive), [ids]);

  return active;
}
