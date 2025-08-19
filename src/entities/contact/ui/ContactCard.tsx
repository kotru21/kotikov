import React, { memo } from "react";
import { colors } from "@/styles/colors";
import { type ContactInfo } from "@/entities/contact/model/types";

export interface ContactCardProps {
  contact: ContactInfo;
}

const ContactCardComponent: React.FC<ContactCardProps> = ({ contact }) => {
  const handleClick = () => {
    if (contact.link) {
      window.open(contact.link, "_blank");
    }
  };

  return (
    <div
      className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
        contact.link ? "cursor-pointer" : ""
      }`}
      style={{
        background: `linear-gradient(135deg, ${colors.neutral[800]}40, ${colors.neutral[700]}30)`,
        border: `1px solid ${colors.neutral[600]}30`,
      }}
      onClick={handleClick}>
      <div className="flex items-center space-x-3">
        <contact.icon
          className="text-2xl"
          style={{ color: colors.neutral[300] }}
        />
        <div>
          <p
            className="font-semibold text-sm"
            style={{ color: colors.neutral[300] }}>
            {contact.label}
          </p>
          <p
            className="text-sm break-all"
            style={{ color: colors.neutral[100] }}>
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
