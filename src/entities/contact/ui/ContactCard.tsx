import React, { memo } from "react";

import type { ContactInfo } from "../model/types";

export interface ContactCardProps {
  contact: ContactInfo;
  variant?: "auto" | "light" | "dark";
  label?: React.ReactNode;
  value?: React.ReactNode;
}

/**
 * Icon wells stay on-brand: mint badge on paper/black cards,
 * inverted black badge on the mint hero card (contrast).
 */
function getIconWellClasses(variant: "auto" | "light" | "dark"): string {
  if (variant === "auto")
    return "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black";
  if (variant === "light") return "border-black bg-primary-500 text-black";
  return "border-black bg-primary-500 text-black dark:border-white";
}

const ContactCardComponent: React.FC<ContactCardProps> = ({
  contact,
  variant = "auto",
  label,
  value,
}) => {
  const isHero = variant === "auto";

  return (
    <div className="h-full border-2 border-transparent p-5 sm:p-6">
      <div
        className={`flex h-full flex-col text-center ${
          isHero
            ? "items-center justify-center gap-5 sm:gap-6"
            : "items-center justify-center gap-3 sm:flex-row sm:justify-start sm:gap-4 sm:text-left"
        }`}
      >
        <div
          className={`flex shrink-0 items-center justify-center border-2 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#fff] ${getIconWellClasses(variant)} ${
            isHero ? "size-16 sm:size-20" : "size-12 sm:size-14"
          }`}
        >
          <contact.icon className={isHero ? "size-8 sm:size-10" : "size-6 sm:size-7"} aria-hidden />
        </div>

        <div className={isHero ? undefined : "min-w-0 sm:flex-1"}>
          <h3
            className={`mb-1 font-black tracking-wider uppercase ${
              isHero ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
            }`}
            style={{ color: "currentColor" }}
          >
            {label ?? contact.label}
          </h3>
          <p
            className={`font-mono font-bold opacity-90 ${
              isHero ? "text-sm sm:text-base" : "truncate text-xs sm:text-sm"
            }`}
            style={{ color: "currentColor" }}
          >
            {value ?? contact.value}
          </p>
        </div>
      </div>
    </div>
  );
};

const ContactCard = memo(ContactCardComponent);
ContactCard.displayName = "ContactCard";

export default ContactCard;
