"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useLayoutEffect, useRef, useState } from "react";

import type { NavigationItem } from "@/entities/navigation";
import { InteractiveElement } from "@/features/interactive-elements";
import { usePerformanceSettings } from "@/features/performance";
import {
  computeNavIslandStyle,
  DESKTOP_NAV_ISLAND_PRESET,
  MOBILE_NAV_ISLAND_PRESET,
  useNavMorph,
} from "@/features/scrolling";
import { ThemeToggle } from "@/features/theme";
import { Logo } from "@/shared/ui";
import { colors } from "@/styles/colors";

interface HeaderNavigationProps {
  navigation: NavigationItem[];
}

const PAINT_INTERACTIVE_THRESHOLD = 0.02;

const px = (value: number): string => `${String(value)}px`;

const islandShellClass =
  "flex origin-center items-center justify-between data-[island=true]:hover:translate-x-px data-[island=true]:hover:translate-y-px motion-safe:transition-[transform,box-shadow] motion-safe:duration-100 motion-safe:ease-out";

const menuPanelEase = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const menuBackdropMotionClass =
  "motion-safe:transition-opacity motion-safe:duration-200 motion-safe:ease-out data-closed:opacity-0";

const menuPanelMotionClass = `group/mobile-panel flex motion-safe:transition-transform motion-safe:duration-250 ${menuPanelEase} data-closed:translate-x-full motion-safe:data-closed:delay-[50ms]`;

const menuShadowMotionClass =
  "bg-black motion-safe:transition-[transform,opacity] motion-safe:duration-250 motion-safe:ease-out motion-safe:delay-75 motion-safe:group-data-[closed]/mobile-panel:-translate-x-full motion-safe:group-data-[closed]/mobile-panel:opacity-0 group-data-[closed]/mobile-panel:delay-0 dark:bg-white";

function resetPaintStyles(root: HTMLElement | null): void {
  if (root === null) return;

  root.querySelectorAll<HTMLElement>("a, button").forEach((el) => {
    if (el.hasAttribute("data-draw-allow")) return;

    el.style.removeProperty("color");
    el.style.removeProperty("background-color");
    el.style.removeProperty("border-color");
    el.style.removeProperty("box-shadow");
  });
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ navigation }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { reducedMotion, lowPerformance } = usePerformanceSettings();
  const snapMenuMotion = reducedMotion || lowPerformance;
  const { progress, isIsland } = useNavMorph();
  const desktopIslandRef = useRef<HTMLDivElement>(null);
  const mobileIslandRef = useRef<HTMLDivElement>(null);

  const isPaintInteractive = progress < PAINT_INTERACTIVE_THRESHOLD;
  const desktopIsland = computeNavIslandStyle(DESKTOP_NAV_ISLAND_PRESET, progress);
  const mobileIsland = computeNavIslandStyle(MOBILE_NAV_ISLAND_PRESET, progress);

  const closeMobileMenu = (): void => {
    setMobileMenuOpen(false);
  };

  const linkBase =
    "font-bold uppercase tracking-[0.12em] whitespace-nowrap transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary dark:focus-visible:ring-offset-background-tertiary";

  const linkClassName = isPaintInteractive
    ? `${linkBase} text-text-secondary dark:text-text-muted hover:text-text-primary dark:hover:text-text-inverse`
    : `${linkBase} text-text-primary dark:text-text-inverse hover:text-primary-700 dark:hover:text-primary-400`;

  const ctaClassName = isPaintInteractive
    ? linkClassName
    : `${linkBase} inline-flex items-center gap-1 border-2 border-black bg-white px-3 py-1.5 text-text-primary shadow-[2px_2px_0_0_rgb(var(--nav-shadow-rgb))] transition-all duration-100 hover:translate-x-px hover:translate-y-px hover:bg-primary-500 hover:text-black hover:shadow-[1px_1px_0_0_rgb(var(--nav-shadow-rgb))] dark:border-white dark:bg-black dark:text-text-inverse dark:hover:bg-primary-500 dark:hover:text-black`;

  useLayoutEffect(() => {
    if (isPaintInteractive) return;
    resetPaintStyles(desktopIslandRef.current);
    resetPaintStyles(mobileIslandRef.current);
  }, [isPaintInteractive, progress]);

  return (
    <header className="fixed inset-x-0 z-50">
      <nav aria-label="Основная навигация" className="px-6 pt-6 pb-2 lg:p-0">
        <div
          className="relative z-10 w-full lg:hidden"
          style={{
            transform: `translate3d(0, ${px(mobileIsland.topOffset)}, 0)`,
          }}
        >
          <div
            ref={mobileIslandRef}
            className={`${islandShellClass}${isIsland ? "" : "gap-4"}`}
            data-island={isIsland ? "true" : "false"}
            style={mobileIsland.islandStyle}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div
                aria-hidden="true"
                className="bg-primary-500 shrink-0"
                style={{ width: 4, height: px(mobileIsland.accentBarHeight) }}
              />
              {isPaintInteractive ? (
                <InteractiveElement
                  as={Link}
                  href="/"
                  data-draw-allow=""
                  data-interactive-color={colors.text.primary}
                  className="inline-flex min-h-11 min-w-11 items-center"
                >
                  <span className="sr-only">ktkv</span>
                  <Logo variant="mobile" className="h-8 w-auto" />
                </InteractiveElement>
              ) : (
                <Link
                  href="/"
                  data-draw-exclude
                  className="inline-flex min-h-11 min-w-11 items-center"
                >
                  <span className="sr-only">ktkv</span>
                  <Logo variant="mobile" className="h-8 w-auto" />
                </Link>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2" data-draw-exclude>
              <ThemeToggle />
              <InteractiveElement
                as="button"
                type="button"
                onClick={() => {
                  setMobileMenuOpen(true);
                }}
                data-draw-exclude
                className="text-text-primary dark:text-text-inverse hover:bg-primary-500 focus-visible:ring-primary-500 dark:hover:bg-primary-500 inline-flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-none border-2 border-black bg-white transition-all duration-100 hover:text-black focus-visible:ring-2 focus-visible:outline-none dark:border-white dark:bg-black dark:hover:text-black"
              >
                <span className="sr-only">Открыть меню</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </InteractiveElement>
            </div>
          </div>
        </div>

        <div
          className="hidden w-full justify-center lg:flex"
          style={{
            transform: `translate3d(0, ${px(desktopIsland.topOffset)}, 0)`,
          }}
        >
          <div
            ref={desktopIslandRef}
            className={islandShellClass}
            data-island={isIsland ? "true" : "false"}
            style={desktopIsland.islandStyle}
          >
            <div className="flex shrink-0 items-center gap-3">
              <div
                aria-hidden="true"
                className="bg-primary-500 shrink-0"
                style={{ width: 4, height: px(desktopIsland.accentBarHeight) }}
              />
              {isPaintInteractive ? (
                <InteractiveElement
                  as={Link}
                  href="/"
                  data-draw-allow=""
                  data-interactive-color={colors.text.primary}
                  className="-m-1.5 inline-flex items-center p-1.5"
                >
                  <span className="sr-only">ktkv</span>
                  <Logo variant="pc" className="h-8 w-auto" />
                </InteractiveElement>
              ) : (
                <Link href="/" data-draw-exclude className="-m-1.5 inline-flex items-center p-1.5">
                  <span className="sr-only">ktkv</span>
                  <Logo variant="pc" className="h-8 w-auto" />
                </Link>
              )}
            </div>

            <div className="flex items-center" style={{ gap: px(desktopIsland.linkGap) }}>
              {navigation.map((item) =>
                isPaintInteractive ? (
                  <InteractiveElement
                    as="a"
                    key={item.name}
                    href={item.href}
                    data-draw-allow=""
                    data-interactive-color={colors.text.primary}
                    className={linkClassName}
                  >
                    {item.name}
                  </InteractiveElement>
                ) : (
                  <a key={item.name} href={item.href} className={linkClassName}>
                    {item.name}
                  </a>
                )
              )}
            </div>

            <div
              className="flex items-center justify-end"
              style={{ gap: px(desktopIsland.actionGap) }}
            >
              {desktopIsland.borderAlpha > 0.5 ? (
                <div
                  aria-hidden="true"
                  className="hidden h-6 w-0.5 bg-black lg:block dark:bg-white"
                  style={{ opacity: desktopIsland.borderAlpha }}
                />
              ) : null}
              <a href="#contacts" className={ctaClassName}>
                Связаться <span aria-hidden="true">&rarr;</span>
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <DialogBackdrop
          transition={!snapMenuMotion}
          className={`fixed inset-0 z-50 bg-black/50 ${snapMenuMotion ? "" : menuBackdropMotionClass}`}
        />
        <DialogPanel
          transition={!snapMenuMotion}
          className={`border-l-primary-500 bg-background-primary dark:border-l-primary-400 fixed inset-y-0 right-0 z-50 w-full sm:max-w-sm dark:border-white dark:bg-black ${
            snapMenuMotion ? "flex" : menuPanelMotionClass
          }`}
        >
          <div
            aria-hidden="true"
            className={`w-2 shrink-0 ${snapMenuMotion ? "bg-black dark:bg-white" : menuShadowMotionClass}`}
          />
          <div className="min-h-0 flex-1 overflow-y-auto border-l-4 border-black p-6 dark:border-white">
            <div className="flex items-center justify-between">
              <InteractiveElement
                as={Link}
                href="/"
                data-draw-exclude
                onClick={closeMobileMenu}
                className="-m-1.5 inline-flex items-center gap-2 p-1.5"
              >
                <span aria-hidden="true" className="bg-primary-500 h-8 w-1" />
                <span className="sr-only">ktkv</span>
                <Logo variant="mobile" className="h-8 w-auto" />
              </InteractiveElement>
              <InteractiveElement
                as="button"
                type="button"
                data-draw-exclude
                onClick={closeMobileMenu}
                className="hover:bg-primary-500 focus-visible:ring-primary-500 inline-flex size-11 shrink-0 items-center justify-center rounded-none border-2 border-transparent transition-all hover:border-black hover:text-black focus-visible:ring-2 focus-visible:outline-none dark:text-white dark:hover:border-white"
              >
                <span className="sr-only">Закрыть меню</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </InteractiveElement>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y-2 divide-black dark:divide-white">
                <div className="space-y-1 py-6">
                  {navigation.map((item) => (
                    <InteractiveElement
                      as="a"
                      key={item.name}
                      href={item.href}
                      data-draw-exclude
                      onClick={closeMobileMenu}
                      className="hover:bg-primary-500 hover:border-l-primary-500 focus-visible:ring-primary-500 dark:hover:border-l-primary-400 -mx-3 inline-flex min-h-11 w-[calc(100%+1.5rem)] items-center rounded-none border-l-4 border-transparent px-3 py-2.5 text-base/7 font-bold tracking-[0.12em] text-black uppercase transition-all hover:text-black focus-visible:ring-2 focus-visible:outline-none dark:text-white"
                    >
                      {item.name}
                    </InteractiveElement>
                  ))}
                </div>
                <div className="flex items-center justify-between py-6">
                  <a
                    href="#contacts"
                    onClick={closeMobileMenu}
                    className="hover:bg-primary-500 focus-visible:ring-primary-500 -mx-3 inline-flex min-h-11 items-center gap-1 rounded-none border-2 border-black bg-white px-3 py-2.5 text-base/7 font-bold tracking-[0.12em] text-black uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] focus-visible:ring-2 focus-visible:outline-none dark:border-white dark:bg-black dark:text-white dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] dark:hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)]"
                  >
                    Связаться <span aria-hidden="true">&rarr;</span>
                  </a>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default HeaderNavigation;
