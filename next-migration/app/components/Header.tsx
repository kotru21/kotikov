"use client";

import { useTheme } from "./ThemeProvider";
import Image from "next/image";

export default function Header() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <div
      className="header"
      style={{ position: "relative", overflow: "hidden" }}>
      {/* Оранжевая полоса справа */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          minHeight: "100%",
          width: "15rem",
          background: "#ed7550",
        }}
      />
      {/* Навигация */}
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid" style={{ paddingLeft: 0 }}>
          <a className="navbar-brand" href="#">
            {/* Логотип для десктопа */}
            <Image
              src="/icons/logo_pc.svg"
              alt="Kotikov"
              width={120}
              height={40}
              className="d-none d-md-block"
              priority
            />
            {/* Логотип для мобильных */}
            <Image
              src="/icons/logo_mobile.svg"
              alt="Kotikov"
              width={80}
              height={30}
              className="d-block d-md-none"
              priority
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  |
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#about-me">
                  Обо мне
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#code-stack">
                  Стек
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#interests">
                  Ещё чёта
                </a>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-link nav-link"
                  onClick={toggleTheme}
                  style={{ border: "none", background: "none" }}>
                  <i className={`bx ${isDark ? "bx-sun" : "bx-moon"}`}></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>{" "}
      {/* Квадратные колонки */}
      <div
        className="d-flex justify-content-between gap-5"
        style={{
          overflow: "hidden",
          zIndex: 1,
          position: "absolute",
          display: "flex",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "800px",
          alignItems: "flex-end",
        }}>
        <div className="quadcol"></div>
        <div className="quadcol-2" style={{ position: "relative" }}>
          <p style={{ position: "absolute", bottom: "-2rem" }}>
            Я люблю котиков
          </p>
        </div>
        <div className="quadcol-3"></div>
        <div className="quadcol-4"></div>
      </div>{" "}
      {/* Социальные сети (мобильная версия) */}
      <div
        className="pc-hide my-social"
        style={{
          width: "100%",
          overflowX: "auto",
          whiteSpace: "nowrap",
          position: "absolute",
          zIndex: 10,
          bottom: "10rem",
          left: 0,
        }}>
        <i
          className="bx bxl-vk"
          onClick={() => window.open("https://vk.com/arsenij_kotikov")}></i>
        <i
          className="bx bxl-youtube"
          onClick={() => window.open("https://youtube.com/@kotikov")}></i>
        <i
          className="bx bxl-twitter"
          onClick={() =>
            window.open("https://twitter.com/arsenij_kotikov")
          }></i>
        <i
          className="bx bxl-gmail"
          onClick={() => (window.location.href = "mailto:kotikovv@proton.me")}
          style={{ paddingRight: "12rem" }}></i>
      </div>
      <Image
        className="pc-hide"
        src="/images/pc_index/orange-special.webp"
        alt="Background decoration"
        width={400}
        height={600}
        style={{
          zIndex: 20,
          position: "absolute",
          height: "90%",
          width: "auto",
          bottom: 0,
          right: "-12rem",
        }}
        priority
      />
      {/* Текст заголовка */}
      <div className="header-text">
        <h2>Web developer</h2>
        <h1>Arsenij Kotikov</h1>
      </div>
    </div>
  );
}
