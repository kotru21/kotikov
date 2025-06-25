"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { AboutMeProps } from "@/types";

export default function AboutMe({ className = "" }: AboutMeProps) {
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [windowPositions, setWindowPositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({});
  const [savedPositions, setSavedPositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggedWindow, setDraggedWindow] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState({
    processor: "Определяется...",
    memory: "Определяется...",
    platform: "Определяется...",
    userAgent: "Определяется...",
    screen: "Определяется...",
    language: "Определяется...",
    online: true,
    hardwareConcurrency: "Определяется...",
  });
  // Функция для получения информации об устройстве
  const getDeviceInfo = () => {
    if (typeof window === "undefined") return;

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      hardwareConcurrency?: number;
      userAgentData?: { platform?: string };
    };
    const screen = window.screen;

    // Определение процессора (приблизительно)
    let processor = "Неизвестен";
    if (nav.hardwareConcurrency) {
      processor = `${nav.hardwareConcurrency}-ядерный процессор`;
    }

    // Определение памяти (если доступно)
    let memory = "Информация недоступна";
    if (nav.deviceMemory) {
      memory = `${nav.deviceMemory} ГБ`;
    } else if (nav.hardwareConcurrency) {
      // Примерная оценка на основе количества ядер
      const estimatedMemory =
        nav.hardwareConcurrency >= 8
          ? "16+ ГБ"
          : nav.hardwareConcurrency >= 4
          ? "8-16 ГБ"
          : "4-8 ГБ";
      memory = `~${estimatedMemory} (оценка)`;
    }

    // Определение платформы
    const platform =
      nav.platform || nav.userAgentData?.platform || "Неизвестна";

    // Определение ОС
    let os = "Неизвестная ОС";
    const userAgent = nav.userAgent;
    if (userAgent.includes("Windows NT 10.0")) os = "Windows 10/11";
    else if (userAgent.includes("Windows NT")) os = "Windows";
    else if (userAgent.includes("Mac OS X")) os = "macOS";
    else if (userAgent.includes("Linux")) os = "Linux";
    else if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
      os = "iOS";

    // Информация о экране
    const screenInfo = `${screen.width}x${screen.height}, ${screen.colorDepth}-бит`;

    setDeviceInfo({
      processor,
      memory,
      platform,
      userAgent: os,
      screen: screenInfo,
      language: nav.language || "Неизвестен",
      online: nav.onLine,
      hardwareConcurrency: nav.hardwareConcurrency?.toString() || "Неизвестно",
    });
  }; // Функция для получения центральной позиции окна
  const getCenterPosition = useMemo(() => {
    if (typeof window === "undefined") return { x: 50, y: 50 };

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Примерный размер окна (можно настроить под конкретные окна)
    const appWindowWidth = 400;
    const appWindowHeight = 300;

    return {
      x: Math.max(50, (windowWidth - appWindowWidth) / 2),
      y: Math.max(50, (windowHeight - appWindowHeight) / 2),
    };
  }, []);

  const openWindow = useCallback(
    (windowId: string) => {
      // Сначала устанавливаем позицию окна
      if (savedPositions[windowId]) {
        setWindowPositions((prev) => ({
          ...prev,
          [windowId]: savedPositions[windowId],
        }));
      } else if (!windowPositions[windowId]) {
        // Иначе устанавливаем окно в центр
        setWindowPositions((prev) => ({
          ...prev,
          [windowId]: getCenterPosition,
        }));
      }

      // Затем показываем окно
      setActiveWindow(windowId);
    },
    [savedPositions, windowPositions, getCenterPosition]
  );

  const closeWindow = () => {
    // Сохраняем текущую позицию окна перед закрытием
    if (activeWindow && windowPositions[activeWindow]) {
      setSavedPositions((prev) => ({
        ...prev,
        [activeWindow]: windowPositions[activeWindow],
      }));
    }
    setActiveWindow(null);
  };

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

  // Обработчики для перемещения окон
  const handleMouseDown = (e: React.MouseEvent, windowId: string) => {
    const target = e.target as HTMLElement;
    // Проверяем, что клик был на заголовке окна
    if (!target.closest(".app-window-header")) return;

    setIsDragging(true);
    setDraggedWindow(windowId);

    const windowPos = windowPositions[windowId] || getCenterPosition;
    setDragOffset({
      x: e.clientX - windowPos.x,
      y: e.clientY - windowPos.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedWindow) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    setWindowPositions((prev) => ({
      ...prev,
      [draggedWindow]: { x: newX, y: newY },
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedWindow(null);
  };
  // Инициализация Prism.js для подсветки синтаксиса
  useEffect(() => {
    if (typeof window !== "undefined" && window.Prism) {
      window.Prism.highlightAll();
    }
  }, [activeWindow]);

  // Получение информации об устройстве при монтировании компонента
  useEffect(() => {
    getDeviceInfo();
  }, []);

  return (
    <div
      className={`content-special about-me  ${className}`}
      style={{ position: "relative", overflow: "hidden" }}
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
              <span style={{ color: "white", marginLeft: "1rem" }}>
                root@macos-pc
              </span>
            </div>

            <div className="about-me-window">
              {/* Иконки на рабочем столе */}
              <div
                className="desktop-icons"
                style={{ position: "absolute", top: "2rem", left: "2rem" }}>
                {" "}
                <div
                  className="icon"
                  onClick={() => openWindow("pc-specs")}
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    marginBottom: "2rem",
                    color: "white",
                  }}>
                  <Image
                    src="/images/pc_index/pingv.svg"
                    alt="PC Specs"
                    width={64}
                    height={64}
                    style={{ display: "block", margin: "0 auto" }}
                    onClick={(e) => handleIconClick(e, "pc-specs")}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      display: "block",
                      marginTop: "0.5rem",
                    }}>
                    Мой пека
                  </span>
                </div>
                <div
                  className="icon"
                  onClick={() => openWindow("vscode")}
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    color: "white",
                  }}>
                  <Image
                    src="/images/svg/vscode-alt.svg"
                    alt="VS Code"
                    width={64}
                    height={64}
                    style={{ display: "block", margin: "0 auto" }}
                    onClick={(e) => handleIconClick(e, "vscode")}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      display: "block",
                      marginTop: "0.5rem",
                    }}>
                    DO NOT
                  </span>
                </div>
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
              </div>{" "}
              {/* Окна приложений */}
              {activeWindow === "pc-specs" && (
                <div
                  className="app-window show"
                  style={{
                    position: "absolute",
                    left: `${
                      windowPositions["pc-specs"]?.x ?? getCenterPosition.x
                    }px`,
                    top: `${
                      windowPositions["pc-specs"]?.y ?? getCenterPosition.y
                    }px`,
                    cursor:
                      isDragging && draggedWindow === "pc-specs"
                        ? "grabbing"
                        : "default",
                  }}
                  onMouseDown={(e) => handleMouseDown(e, "pc-specs")}>
                  <div className="app-window-header" style={{ cursor: "grab" }}>
                    <i className="bx bx-info-circle"></i>О пека
                    <button
                      onClick={closeWindow}
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
                    {" "}
                    <div className="window-content">
                      <table>
                        <tbody>
                          <tr>
                            <td className="pc_specs-special" colSpan={2}>
                              Характеристики устройства
                            </td>
                          </tr>
                          <tr>
                            <td>Процессор</td>
                            <td>{deviceInfo.processor}</td>
                          </tr>
                          <tr>
                            <td>Количество ядер</td>
                            <td>{deviceInfo.hardwareConcurrency}</td>
                          </tr>
                          <tr>
                            <td>Оперативная память</td>
                            <td>{deviceInfo.memory}</td>
                          </tr>
                          <tr>
                            <td>Платформа</td>
                            <td>{deviceInfo.platform}</td>
                          </tr>
                          <tr>
                            <td>Операционная система</td>
                            <td>{deviceInfo.userAgent}</td>
                          </tr>
                          <tr>
                            <td>Разрешение экрана</td>
                            <td>{deviceInfo.screen}</td>
                          </tr>
                          <tr>
                            <td>Язык системы</td>
                            <td>{deviceInfo.language}</td>
                          </tr>
                          <tr>
                            <td>Статус сети</td>
                            <td>{deviceInfo.online ? "Онлайн" : "Офлайн"}</td>
                          </tr>
                          <tr>
                            <td>Код устройства</td>
                            <td>
                              USER-DEVICE-{Date.now().toString().slice(-4)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}{" "}
              {activeWindow === "tiktok" && (
                <div
                  className="app-window show"
                  style={{
                    position: "absolute",
                    left: `${
                      windowPositions["tiktok"]?.x ?? getCenterPosition.x
                    }px`,
                    top: `${
                      windowPositions["tiktok"]?.y ?? getCenterPosition.y
                    }px`,
                    cursor:
                      isDragging && draggedWindow === "tiktok"
                        ? "grabbing"
                        : "default",
                  }}
                  onMouseDown={(e) => handleMouseDown(e, "tiktok")}>
                  <div className="app-window-header" style={{ cursor: "grab" }}>
                    <i className="bx bxl-tiktok"></i>TikTok
                    <button
                      onClick={closeWindow}
                      style={{
                        float: "right",
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                      }}>
                      ×
                    </button>
                  </div>{" "}
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
                  </div>{" "}
                </div>
              )}{" "}
              {activeWindow === "vscode" && (
                <div
                  className="app-window show"
                  style={{
                    position: "absolute",
                    left: `${
                      windowPositions["vscode"]?.x ?? getCenterPosition.x
                    }px`,
                    top: `${
                      windowPositions["vscode"]?.y ?? getCenterPosition.y
                    }px`,
                    cursor:
                      isDragging && draggedWindow === "vscode"
                        ? "grabbing"
                        : "default",
                  }}
                  onMouseDown={(e) => handleMouseDown(e, "vscode")}>
                  <div className="app-window-header" style={{ cursor: "grab" }}>
                    <i className="bx bx-question-mark"></i>NASA source code(?)
                    <button
                      onClick={closeWindow}
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
                    <pre className="line-numbers">
                      <code className="language-python">{`from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
from transformers import *
from googletrans import Translator


app = FastAPI()
ideal_steps = 10000
# Recommendation
recommendation_first = []
recommendation_second = []



#CORS

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=['*']
)


@app.get("/get_recommendation")
async def get_reccomendation():
    if len(recommendation_first) == 0:
        recommendation = recommendation_second[random.randint(0, len(recommendation_second) - 1)]
    else:
        recommendation = recommendation_first[random.randint(0, len(recommendation_first) - 1)]
    rec = recommendation
    return {"recommendation": rec}


@app.get("/test")
async def get_test():
    return{"Arseniy": "Debil"}



@app.get("/get_daily_info")
async def get_daily_info():
    return {
    "weight":status_weight, 
    "calories":status_calories,
    "water":status_water, 
    "sleep":status_sleep,
    "steps":status_steps
    }

@app.get("/get_person_info")
async def get_person_info():
    return {
    "weight":ideal_weight,
    "calories":ideal_calories,
    "sleep":ideal_sleep,
    "steps":ideal_steps,
    "water":ideal_water
    }`}</code>
                    </pre>
                  </div>
                </div>
              )}{" "}
              {activeWindow === "vscode-main" && (
                <div
                  className="app-window show"
                  style={{
                    position: "absolute",
                    left: `${
                      windowPositions["vscode-main"]?.x ?? getCenterPosition.x
                    }px`,
                    top: `${
                      windowPositions["vscode-main"]?.y ?? getCenterPosition.y
                    }px`,
                    cursor:
                      isDragging && draggedWindow === "vscode-main"
                        ? "grabbing"
                        : "default",
                  }}
                  onMouseDown={(e) => handleMouseDown(e, "vscode-main")}>
                  <div className="app-window-header" style={{ cursor: "grab" }}>
                    <i className="bx bx-code-alt"></i>VS Code
                    <button
                      onClick={closeWindow}
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
                  <div
                    className="app-window-body"
                    style={{
                      background: "#1e1e1e",
                      color: "#d4d4d4",
                      fontFamily: "monospace",
                    }}>
                    <pre style={{ margin: 0, padding: "1rem" }}>
                      {`// Добро пожаловать в мой код!
function greeting() {
  const developer = "Arsenij Kotikov";
  const skills = ["React", "Next.js", "TypeScript", "Python"];
  
  console.log(\`Привет! Я \${developer}\`);
  console.log("Мои навыки:", skills.join(", "));
}

greeting();`}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
