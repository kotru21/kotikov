import React, { memo } from "react";

import type { ContactInfo } from "../model/types";

export interface ContactCardProps {
  contact: ContactInfo;
  variant?: "auto" | "light" | "dark";
}

const ContactCardComponent: React.FC<ContactCardProps> = ({ contact, variant = "auto" }) => {
  let iconContainerClasses = "";
  if (variant === "auto") {
    iconContainerClasses = "bg-black dark:bg-white text-white dark:text-black";
  } else if (variant === "light") {
    iconContainerClasses = "bg-black text-white"; // For light backgrounds (Yellow/White)
  } else {
    iconContainerClasses = "bg-white text-black"; // For dark backgrounds (Blue/Red/Black)
  }

  return (
    <div
      className={`p-6 transition-all duration-300 border-2 border-transparent`}
      style={{
        background: "transparent",
      }}>

      <div className="flex flex-col items-center space-y-4 text-center">
        <div className={`p-4 border-2 border-transparent hover:scale-110 transition-transform duration-200 ${iconContainerClasses}`}>
            <contact.icon
              className="text-2xl"
            />
        </div>
        <div>
          <h3
            className="font-black text-xl uppercase tracking-wider mb-2"
            style={{ color: "currentColor" }}>
            {contact.label}
          </h3>
          <p
            className="text-sm font-bold opacity-90 font-mono"
            style={{ color: "currentColor" }}>
            {contact.value}
          </p>
        </div>
      </div>
    </div>
  );
};

const ContactCard = memo(ContactCardComponent);
ContactCard.displayName = "ContactCard";

export default ContactCard;
