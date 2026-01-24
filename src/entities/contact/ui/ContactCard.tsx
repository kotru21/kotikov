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
      className="border-2 border-transparent p-6 transition-all duration-300"
      style={{
        background: "transparent",
      }}
    >
      <div className="flex flex-col items-center space-y-4 text-center">
        <div
          className={`border-2 border-transparent p-4 transition-transform duration-200 hover:scale-110 ${iconContainerClasses}`}
        >
          <contact.icon className="text-2xl" />
        </div>
        <div>
          <h3
            className="mb-2 text-xl font-black tracking-wider uppercase"
            style={{ color: "currentColor" }}
          >
            {contact.label}
          </h3>
          <p className="font-mono text-sm font-bold opacity-90" style={{ color: "currentColor" }}>
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
