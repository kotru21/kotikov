import React from "react";

interface PawCursorIconProps {
  className?: string;
}

const PawCursorIcon: React.FC<PawCursorIconProps> = ({ className = "size-10" }) => {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={className}>
      <ellipse cx="11" cy="9" rx="3.2" ry="4" />
      <ellipse cx="21" cy="9" rx="3.2" ry="4" />
      <ellipse cx="7" cy="16" rx="2.8" ry="3.6" />
      <ellipse cx="25" cy="16" rx="2.8" ry="3.6" />
      <path d="M16 28c-5.2 0-9.5-3.8-9.5-8.4 0-2.2 1.6-3.6 3.4-3.6 1.6 0 2.8.9 3.5 2.1.7-1.2 1.9-2.1 3.5-2.1 1.8 0 3.4 1.4 3.4 3.6C25.5 24.2 21.2 28 16 28z" />
    </svg>
  );
};

export default PawCursorIcon;
