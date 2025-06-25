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
      className="icon"
      onClick={onClick}
      style={{
        cursor: "pointer",
        textAlign: "center",
        marginBottom: "2rem",
        color: "white",
      }}>
      <Image
        src={src}
        alt={alt}
        width={64}
        height={64}
        style={{ display: "block", margin: "0 auto" }}
        onClick={onIconClick}
      />
      <span
        style={{
          fontSize: "12px",
          display: "block",
          marginTop: "0.5rem",
        }}>
        {label}
      </span>
    </div>
  );
}
