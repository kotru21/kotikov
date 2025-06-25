"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { AboutMeProps } from "@/types";
import PCSpecsWindow from "./windows/PCSpecsWindow";
import TikTokWindow from "./windows/TikTokWindow";
import VSCodeWindow from "./windows/VSCodeWindow";
import VSCodeMainWindow from "./windows/VSCodeMainWindow";
import DesktopIcon from "./DesktopIcon";
import { useWindowManager } from "../hooks/useWindowManager";
import { useDeviceInfo } from "../hooks/useDeviceInfo";

export default function AboutMe({ className = "" }: AboutMeProps) {
  // Используем кастомные хуки
  const {
    activeWindow,
    windowPositions,
    dragState,
    getCenterPosition,
    openWindow,
    closeWindow,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useWindowManager();

  // Получаем информацию об устройстве
  const deviceInfo = useDeviceInfo();

  // Функция для обработки клика по иконке с анимацией
  const handleIconClick = (
    e: React.MouseEvent<HTMLImageElement>,
    windowId: string
  ) => {
    const img = e.currentTarget;
    img.classList.add("bounce");
    setTimeout(() => {
      img.classList.remove("bounce");
    }, 1000);
    openWindow(windowId);
  };

  // Инициализация Prism.js для подсветки синтаксиса
  useEffect(() => {
    if (typeof window !== "undefined" && window.Prism) {
      window.Prism.highlightAll();
    }
  }, [activeWindow]);

  return (
    <div
      className={`content-special about-me about-me-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Останавливаем перетаскивание при выходе курсора
    >
      <div className="row row-cols-1 row-cols-md-2 g-1" id="about-me">
        <div className="col-lg-7">
          <div className="window">
            <div className="titlebar">
              <div className="buttons">
                <div className="close">
                  <a className="closebutton" href="#">
                    <span className="window-span">
                      <strong>×</strong>
                    </span>
                  </a>
                </div>
                <div className="minimize">
                  <a className="minimizebutton" href="#">
                    <span className="window-span">
                      <strong>–</strong>
                    </span>
                  </a>
                </div>
                <div className="zoom">
                  <a className="zoombutton" href="#">
                    <span className="window-span">
                      <strong>+</strong>
                    </span>
                  </a>
                </div>
              </div>
              <span className="about-me-titlebar-text">
                root@macos-pc
              </span>
            </div>

            <div className="about-me-window">
              {/* Иконки на рабочем столе */}
              <div className="desktop-icons about-me-desktop-icons">
                <DesktopIcon
                  src="/images/pc_index/pingv.svg"
                  alt="PC Specs"
                  label="Мой пека"
                  onClick={() => openWindow("pc-specs")}
                  onIconClick={(e) => handleIconClick(e, "pc-specs")}
                />
                <DesktopIcon
                  src="/images/svg/vscode-alt.svg"
                  alt="VS Code"
                  label="DO NOT"
                  onClick={() => openWindow("vscode")}
                  onIconClick={(e) => handleIconClick(e, "vscode")}
                />
              </div>

              {/* Док-панель */}
              <div className="dock">
                <ul>
                  <li>
                    <a onClick={() => openWindow("tiktok")}>
                      <Image
                        src="/images/svg/tiktok.svg"
                        alt="TikTok"
                        width={40}
                        height={40}
                      />
                    </a>
                  </li>
                  <li>
                    <a onClick={() => openWindow("vscode-main")}>
                      <Image
                        src="/images/svg/vscode.svg"
                        alt="VS Code"
                        width={40}
                        height={40}
                      />
                    </a>
                  </li>
                </ul>
              </div>

              {/* Окна приложений */}
              {activeWindow === "pc-specs" && (
                <PCSpecsWindow
                  windowId="pc-specs"
                  position={windowPositions["pc-specs"] || getCenterPosition}
                  isDragging={
                    dragState.isDragging &&
                    dragState.draggedWindow === "pc-specs"
                  }
                  onMouseDown={handleMouseDown}
                  onClose={closeWindow}
                  deviceInfo={deviceInfo}
                />
              )}

              {activeWindow === "tiktok" && (
                <TikTokWindow
                  windowId="tiktok"
                  position={windowPositions["tiktok"] || getCenterPosition}
                  isDragging={
                    dragState.isDragging && dragState.draggedWindow === "tiktok"
                  }
                  onMouseDown={handleMouseDown}
                  onClose={closeWindow}
                />
              )}

              {activeWindow === "vscode" && (
                <VSCodeWindow
                  windowId="vscode"
                  position={windowPositions["vscode"] || getCenterPosition}
                  isDragging={
                    dragState.isDragging && dragState.draggedWindow === "vscode"
                  }
                  onMouseDown={handleMouseDown}
                  onClose={closeWindow}
                />
              )}

              {activeWindow === "vscode-main" && (
                <VSCodeMainWindow
                  windowId="vscode-main"
                  position={windowPositions["vscode-main"] || getCenterPosition}
                  isDragging={
                    dragState.isDragging &&
                    dragState.draggedWindow === "vscode-main"
                  }
                  onMouseDown={handleMouseDown}
                  onClose={closeWindow}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
