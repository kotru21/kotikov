"use client";

import { useEffect, useState } from "react";

export type ActiveSectionId = "about" | "projects" | "skills" | "experience" | "contacts" | null;

export const ACTIVE_SECTION_THRESHOLDS = [0, 0.25, 0.5, 0.75, 1] as const;

const MD_MIN_WIDTH = "(min-width: 768px)";
const FALLBACK_TITLE_INSET_PX = 48;
const FALLBACK_BAR_INSET_PX = 56;

export const DESKTOP_CHROME_ROOT_MARGIN = "0px 0px -56px 0px";
/** Fallback when chrome is not in the DOM. IO only accepts px/%. */
export const MOBILE_CHROME_ROOT_MARGIN = "-48px 0px -56px 0px";

export const ACTIVE_SECTION_OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: [...ACTIVE_SECTION_THRESHOLDS],
  rootMargin: DESKTOP_CHROME_ROOT_MARGIN,
};

function isDesktopViewport(): boolean {
  if (typeof window.matchMedia !== "function") {
    return true;
  }
  return window.matchMedia(MD_MIN_WIDTH).matches;
}

function roundPx(value: number): string {
  return `${String(Math.round(value))}px`;
}

function measuredHeight(el: Element | null): number | null {
  if (!(el instanceof HTMLElement)) return null;
  const height = el.getBoundingClientRect().height;
  return height > 0 ? height : null;
}

function paddingPx(el: Element | null, side: "paddingTop" | "paddingBottom"): number {
  if (!(el instanceof HTMLElement)) return 0;
  const raw = Number.parseFloat(getComputedStyle(el)[side]);
  return Number.isFinite(raw) ? raw : 0;
}

function desktopRootMargin(): string {
  const bar = document.querySelector("[data-chrome='desktop']");
  const height = measuredHeight(bar) ?? FALLBACK_BAR_INSET_PX;
  return `0px 0px -${roundPx(height)} 0px`;
}

function mobileRootMargin(): string {
  const titleBar = document.querySelector("[data-chrome='title']");
  const navBar = document.querySelector("[data-chrome='mobile']");
  const titleShell = document.querySelector("[data-chrome-shell='title']");
  const navShell = document.querySelector("[data-chrome-shell='mobile']");
  const top =
    (measuredHeight(titleBar) ?? FALLBACK_TITLE_INSET_PX) + paddingPx(titleShell, "paddingTop");
  const bottom =
    (measuredHeight(navBar) ?? FALLBACK_BAR_INSET_PX) + paddingPx(navShell, "paddingBottom");
  return `-${roundPx(top)} 0px -${roundPx(bottom)} 0px`;
}

function chromeRootMargin(): string {
  return isDesktopViewport() ? desktopRootMargin() : mobileRootMargin();
}

function observerOptionsForViewport(): IntersectionObserverInit {
  return {
    threshold: [...ACTIVE_SECTION_THRESHOLDS],
    rootMargin: chromeRootMargin(),
  };
}

function subscribeMdBreakpoint(onChange: () => void): () => void {
  if (typeof window.matchMedia !== "function") {
    return () => undefined;
  }
  const media = window.matchMedia(MD_MIN_WIDTH);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
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

  useEffect(() => {
    let teardown = observeSections(ids, setActive);
    const unsubscribe = subscribeMdBreakpoint(() => {
      teardown();
      teardown = observeSections(ids, setActive);
    });
    return () => {
      unsubscribe();
      teardown();
    };
  }, [ids]);

  return active;
}
