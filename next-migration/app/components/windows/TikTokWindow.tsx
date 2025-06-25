import React from "react";
import Image from "next/image";
import { WindowProps } from "./types";

export default function TikTokWindow({
  windowId,
  position,
  isDragging,
  onMouseDown,
  onClose,
}: WindowProps) {
  return (
    <div
      className="app-window show"
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "default",
      }}
      onMouseDown={(e) => onMouseDown(e, windowId)}>
      <div className="app-window-header" style={{ cursor: "grab" }}>
        <i className="bx bxl-tiktok"></i>TikTok
        <button
          onClick={onClose}
          style={{
            float: "right",
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}>
          ×
        </button>
      </div>
      <div className="app-window-body">
        <header className="tiktok-header">
          <div className="tiktok logo">
            <Image
              src="/images/svg/tiktok.svg"
              alt="TikTok Logo"
              width={40}
              height={40}
            />
          </div>
        </header>
        <main>
          <blockquote
            className="tiktok-embed"
            cite="https://www.tiktok.com/@arsenij_kotikov"
            data-unique-id="arsenij_kotikov"
            data-embed-type="creator">
            <section>
              <a
                target="_blank"
                href="https://www.tiktok.com/@arsenij_kotikov?refer=creator_embed"
                rel="noopener noreferrer">
                @arsenij_kotikov
              </a>
            </section>
          </blockquote>
        </main>
      </div>
    </div>
  );
}
