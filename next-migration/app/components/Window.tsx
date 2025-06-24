"use client";

import React, { useState } from "react";
import { WindowProps } from "@/types";

export default function Window({
  title,
  children,
  isMinimized = false,
  onClose,
  onMinimize,
  onMaximize,
  className = "",
}: WindowProps) {
  const [minimized, setMinimized] = useState(isMinimized);

  const handleClose = () => {
    onClose?.();
  };

  const handleMinimize = () => {
    setMinimized(!minimized);
    onMinimize?.();
  };

  const handleMaximize = () => {
    onMaximize?.();
  };

  return (
    <div className={`window ${className}`}>
      <div className="titlebar">
        <div className="buttons">
          <div className="close">
            <a className="closebutton" href="#" onClick={handleClose}>
              <span className="window-span">
                <strong>×</strong>
              </span>
            </a>
          </div>
          <div className="minimize">
            <a className="minimizebutton" href="#" onClick={handleMinimize}>
              <span className="window-span">
                <strong>–</strong>
              </span>
            </a>
          </div>
          <div className="zoom">
            <a className="zoombutton" href="#" onClick={handleMaximize}>
              <span className="window-span">
                <strong>+</strong>
              </span>
            </a>
          </div>
        </div>
        {title && (
          <div
            className="window-title"
            style={{ marginLeft: "1rem", color: "white" }}>
            {title}
          </div>
        )}
      </div>
      {!minimized && (
        <div className="window-content" style={{ padding: "1rem" }}>
          {children}
        </div>
      )}
    </div>
  );
}
