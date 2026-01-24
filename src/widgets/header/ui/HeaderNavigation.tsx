"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useState } from "react";

import type { NavigationItem } from "@/entities/navigation";
import { InteractiveElement } from "@/features/interactive-elements";
import { Logo } from "@/shared/ui";
import { colors } from "@/styles/colors";

interface HeaderNavigationProps {
  navigation: NavigationItem[];
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ navigation }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <InteractiveElement
            as={Link}
            href="/"
            data-draw-allow
            data-interactive-color={colors.text.primary}
            className="inline-flex items-center -m-1.5 p-1.5"
          >
            <span className="sr-only">ktkv</span>
            {/* Логотип для мобильных устройств */}
            <Logo variant="mobile" className="h-8 w-auto lg:hidden" />
            {/* Логотип для ПК */}
            <Logo variant="pc" className="hidden h-8 w-auto lg:block" />
          </InteractiveElement>
        </div>
        <div className="flex lg:hidden">
          <InteractiveElement
            as="button"
            type="button"
            onClick={() => {
              setMobileMenuOpen(true);
            }}
            data-draw-allow
            className="text-text-secondary dark:text-text-muted hover:text-text-primary dark:hover:text-text-inverse -m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </InteractiveElement>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <InteractiveElement
              as="a"
              key={item.name}
              href={item.href}
              data-draw-allow
              className="text-text-secondary dark:text-text-muted hover:text-text-primary dark:hover:text-text-inverse text-sm/6 font-semibold transition-colors"
            >
              {item.name}
            </InteractiveElement>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <InteractiveElement
            as="button"
            type="button"
            data-draw-allow            data-interactive-color={colors.text.primary}            className="text-text-secondary dark:text-text-muted hover:text-text-primary dark:hover:text-text-inverse text-sm/6 font-semibold transition-colors"
          >
            Туда <span aria-hidden="true">&rarr;</span>
          </InteractiveElement>
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50 bg-black/50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto border-l-2 border-black bg-white p-6 shadow-[0_0_0_1000px_rgba(0,0,0,0.5)] sm:max-w-sm dark:border-white dark:bg-black">
          <div className="flex items-center justify-between">
            <InteractiveElement as={Link} href="/" data-draw-exclude className="-m-1.5 p-1.5">
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
              className="hover:bg-primary-500 -m-2.5 rounded-none border-2 border-transparent p-2.5 text-black transition-all hover:border-black hover:text-black dark:text-white dark:hover:border-white"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </InteractiveElement>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y-2 divide-black/10 dark:divide-white/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <InteractiveElement
                    as="a"
                    key={item.name}
                    href={item.href}
                    data-draw-exclude
                    className="hover:bg-primary-500 -mx-3 block rounded-none px-3 py-2 text-base/7 font-bold text-black uppercase transition-colors hover:text-black dark:text-white"
                  >
                    {item.name}
                  </InteractiveElement>
                ))}
              </div>
              <div className="py-6">
                <button
                  type="button"
                  data-draw-exclude
                  className="hover:bg-primary-500 -mx-3 block rounded-none px-3 py-2.5 text-base/7 font-bold text-black uppercase transition-colors hover:text-black dark:text-white"
                >
                  Туда
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default HeaderNavigation;
