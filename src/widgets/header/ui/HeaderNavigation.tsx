"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useLayoutEffect, useRef, useState } from "react";

import type { NavigationItem } from "@/entities/navigation";
import { InteractiveElement } from "@/features/interactive-elements";
import { lerp, useNavMorph } from "@/features/scrolling";
import { ThemeToggle } from "@/features/theme";
import { Logo } from "@/shared/ui";
import { colors } from "@/styles/colors";

interface HeaderNavigationProps {
  navigation: NavigationItem[];
}

const PAINT_INTERACTIVE_THRESHOLD = 0.02;

const px = (value: number): string => `${String(value)}px`;

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
  const { progress, isIsland } = useNavMorph();
  const islandRef = useRef<HTMLDivElement>(null);

  const isPaintInteractive = progress < PAINT_INTERACTIVE_THRESHOLD;
  const scrollBlend = Math.min(1, progress * 1.6);

  const islandPaddingX = lerp(32, 16, progress);
  const islandPaddingY = lerp(24, 10, progress);
  const linkGap = lerp(48, 12, progress);
  const bgOpacity = lerp(0, 1, scrollBlend);
  const topOffset = lerp(0, 12, progress);
  const fontSize = lerp(14, 12, progress);
  const borderAlpha = lerp(0, 1, scrollBlend);
  const shadowOffset = lerp(0, 4, scrollBlend);
  const accentBarHeight = lerp(0, 32, scrollBlend);
  const islandWidth = `${String(lerp(100, 58, progress))}vw`;

  const islandStyle: React.CSSProperties = {
    width: islandWidth,
    maxWidth: "100%",
    marginInline: "auto",
    borderRadius: 0,
    paddingInline: px(islandPaddingX),
    paddingBlock: px(islandPaddingY),
    gap: px(linkGap),
    fontSize: px(fontSize),
    backgroundColor:
      bgOpacity > 0 ? `rgb(var(--nav-island-bg) / ${String(bgOpacity)})` : "transparent",
    borderWidth: borderAlpha > 0 ? 2 : 0,
    borderStyle: "solid",
    borderColor:
      borderAlpha > 0
        ? `rgb(var(--nav-island-border-rgb) / calc(var(--nav-island-border-alpha) * ${String(borderAlpha)}))`
        : "transparent",
    boxShadow:
      shadowOffset > 0
        ? `${px(shadowOffset)} ${px(shadowOffset)} 0 0 rgb(var(--nav-shadow-rgb) / ${String(scrollBlend)})`
        : undefined,
    willChange: "transform, width, padding, box-shadow, border-color",
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
    resetPaintStyles(islandRef.current);
  }, [isPaintInteractive, progress]);

  return (
    <header
      className="absolute inset-x-0 z-50 lg:fixed"
      style={{
        transform: `translate3d(0, ${px(topOffset)}, 0)`,
        willChange: "transform",
      }}
    >
      <nav aria-label="Global" className="px-6 pt-6 pb-2 lg:p-0">
        <div className="relative z-10 flex items-center justify-between gap-4 lg:hidden">
          <InteractiveElement
            as={Link}
            href="/"
            data-draw-allow={isPaintInteractive ? "" : undefined}
            data-draw-exclude={isPaintInteractive ? undefined : ""}
            data-interactive-color={isPaintInteractive ? colors.text.primary : undefined}
            className="inline-flex min-h-11 min-w-11 items-center"
          >
            <span className="sr-only">ktkv</span>
            <Logo variant="mobile" className="h-8 w-auto" />
          </InteractiveElement>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <InteractiveElement
              as="button"
              type="button"
              onClick={() => {
                setMobileMenuOpen(true);
              }}
              data-draw-exclude
              className="text-text-primary dark:text-text-inverse hover:bg-primary-500 focus-visible:ring-primary-500 dark:hover:bg-primary-500 inline-flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-none border-2 border-black bg-white transition-all duration-100 focus-visible:ring-2 focus-visible:outline-none hover:text-black dark:border-white dark:bg-black dark:hover:text-black"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </InteractiveElement>
          </div>
        </div>

        <div className="hidden w-full justify-center lg:flex">
          <div
            ref={islandRef}
            className="flex origin-center items-center justify-between data-[island=true]:hover:translate-x-px data-[island=true]:hover:translate-y-px motion-safe:transition-[transform,box-shadow] motion-safe:duration-100 motion-safe:ease-out"
            data-island={isIsland ? "true" : "false"}
            style={islandStyle}
          >
            <div className="flex shrink-0 items-center gap-3">
              <div
                aria-hidden="true"
                className="bg-primary-500 shrink-0"
                style={{ width: 4, height: px(accentBarHeight) }}
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
                <Link href="/" className="-m-1.5 inline-flex items-center p-1.5">
                  <span className="sr-only">ktkv</span>
                  <Logo variant="pc" className="h-8 w-auto" />
                </Link>
              )}
            </div>

            <div className="flex items-center" style={{ gap: px(linkGap) }}>
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
              style={{ gap: px(lerp(16, 10, progress)) }}
            >
              {borderAlpha > 0.5 ? (
                <div
                  aria-hidden="true"
                  className="hidden h-6 w-0.5 bg-black lg:block dark:bg-white"
                  style={{ opacity: borderAlpha }}
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
        <div className="fixed inset-0 z-50 bg-black/50" />
        <DialogPanel className="border-l-primary-500 bg-background-primary dark:border-l-primary-400 fixed inset-y-0 right-0 z-50 w-full overflow-y-auto border-l-4 border-black p-6 shadow-[8px_0_0_0_rgba(0,0,0,1)] sm:max-w-sm dark:border-white dark:bg-black dark:shadow-[8px_0_0_0_rgba(255,255,255,1)]">
          <div className="flex items-center justify-between">
            <InteractiveElement
              as={Link}
              href="/"
              data-draw-exclude
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
              onClick={() => {
                setMobileMenuOpen(false);
              }}
              className="hover:bg-primary-500 focus-visible:ring-primary-500 inline-flex size-11 shrink-0 items-center justify-center rounded-none border-2 border-transparent transition-all focus-visible:ring-2 focus-visible:outline-none hover:border-black hover:text-black dark:text-white dark:hover:border-white"
            >
              <span className="sr-only">Close menu</span>
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
                    className="hover:bg-primary-500 hover:border-l-primary-500 focus-visible:ring-primary-500 dark:hover:border-l-primary-400 -mx-3 block rounded-none border-l-4 border-transparent px-3 py-2.5 text-base/7 font-bold tracking-[0.12em] text-black uppercase transition-all focus-visible:ring-2 focus-visible:outline-none hover:text-black dark:text-white"
                  >
                    {item.name}
                  </InteractiveElement>
                ))}
              </div>
              <div className="flex items-center justify-between py-6">
                <a
                  href="#contacts"
                  className="hover:bg-primary-500 focus-visible:ring-primary-500 -mx-3 inline-flex min-h-11 items-center gap-1 rounded-none border-2 border-black bg-white px-3 py-2.5 text-base/7 font-bold tracking-[0.12em] text-black uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all focus-visible:ring-2 focus-visible:outline-none hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:text-white dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] dark:hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)]"
                >
                  Связаться <span aria-hidden="true">&rarr;</span>
                </a>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default HeaderNavigation;
