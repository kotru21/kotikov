import React, { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { colors } from "../../styles/colors";
import { NavigationItem } from "../../types";

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
            <span className="sr-only">Your Company</span>
            {/* Логотип для мобильных устройств */}
            <Image
              alt=""
              src="/logo_mobile.svg"
              width={32}
              height={32}
              className="h-8 w-auto lg:hidden"
            />
            {/* Логотип для ПК */}
            <Image
              alt=""
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
            style={{ color: colors.text.secondary }}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5">
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              style={{ color: colors.text.secondary }}
              className="text-sm/6 font-semibold hover:text-white transition-colors">
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a
            href="#"
            style={{ color: colors.text.secondary }}
            className="text-sm/6 font-semibold hover:text-white transition-colors">
            Туда <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel
          style={{ backgroundColor: colors.background.light }}
          className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image
                alt=""
                src="/Logo_mobile.svg"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: colors.text.inverse }}
              className="-m-2.5 rounded-md p-2.5">
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-300/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    style={{ color: colors.text.inverse }}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold hover:bg-gray-50">
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="#"
                  style={{ color: colors.text.inverse }}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold hover:bg-gray-50">
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
