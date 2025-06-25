import React from "react";
import Image from "next/image";

interface DesktopIconProps {
  src: string;
  alt: string;
  label: string;
  onClick: () => void;
  onIconClick: (e: React.MouseEvent<HTMLImageElement>) => void;
}

export default function DesktopIcon({
  src,
  alt,
  label,
  onClick,
  onIconClick,
}: DesktopIconProps) {
  return (
    <div
      className="icon desktop-icon"
      onClick={onClick}>
      <Image
        src={src}
        alt={alt}
        width={64}
        height={64}
        className="desktop-icon-image"
        onClick={onIconClick}
      />
      <span className="desktop-icon-label">
        {label}
      </span>
    </div>
  );
}
