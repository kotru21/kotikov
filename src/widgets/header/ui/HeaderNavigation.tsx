"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useState } from "react";

import type { NavigationItem } from "@/entities/navigation";

interface HeaderNavigationProps {
  navigation: NavigationItem[];
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ navigation }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">ktkv</span>
            {/* Логотип для мобильных устройств */}
            <Image
              alt="Kotikov логотип"
              src="/logo_mobile.svg"
              width={32}
              height={32}
              className="h-8 w-auto lg:hidden"
            />
            {/* Логотип для ПК */}
            <Image
              alt="Kotikov логотип"
              src="/logo_pc.svg"
              width={32}
              height={32}
              className="h-8 w-auto hidden lg:block"
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-text-secondary dark:text-text-muted hover:text-text-primary dark:hover:text-text-inverse">
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm/6 font-semibold text-text-secondary dark:text-text-muted hover:text-text-primary dark:hover:text-text-inverse transition-colors">
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a
            href="#"
            className="text-sm/6 font-semibold text-text-secondary dark:text-text-muted hover:text-text-primary dark:hover:text-text-inverse transition-colors">
            Туда <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden">
        <div className="fixed inset-0 z-50 bg-black/50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto p-6 sm:max-w-sm border-l-2 border-black dark:border-white bg-white dark:bg-black shadow-[0_0_0_1000px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">ktkv</span>
              <Image
                alt="Kotikov логотип"
                src="/logo_mobile.svg"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-none p-2.5 text-black dark:text-white border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-red-500 hover:text-white transition-all">
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y-2 divide-black/10 dark:divide-white/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-none px-3 py-2 text-base/7 font-bold uppercase text-black dark:text-white hover:bg-[#d12c1f] hover:text-white transition-colors">
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-none px-3 py-2.5 text-base/7 font-bold uppercase text-black dark:text-white hover:bg-[#d12c1f] hover:text-white transition-colors">
                  Туда
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default HeaderNavigation;
