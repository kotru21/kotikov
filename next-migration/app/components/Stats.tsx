"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface CodewarsData {
  username: string;
  ranks: {
    overall: {
      name: string;
    };
  };
  honor: number;
  codeChallenges: {
    totalCompleted: number;
  };
}

interface LeetcodeData {
  ranking: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
}

export default function Stats() {
  const [codewarsData, setCodewarsData] = useState<CodewarsData | null>(null);
  const [leetcodeData, setLeetcodeData] = useState<LeetcodeData | null>(null);

  useEffect(() => {
    // Загружаем данные Codewars
    const username = "Arsenij%20Kotikov";
    fetch(`https://www.codewars.com/api/v1/users/${username}`)
      .then((response) => response.json())
      .then((data) => setCodewarsData(data))
      .catch((error) => console.error("Codewars API error:", error));

    // Загружаем данные Leetcode
    const leetcodeUsername = "kotru21";
    fetch(`https://leetcode-stats-api.herokuapp.com/${leetcodeUsername}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setLeetcodeData(data))
      .catch((error) => console.error("Leetcode API error:", error));
  }, []);
  // Анимация элементов
  useEffect(() => {
    const container = document.getElementById("container");
    if (!container) return;

    const winWidth = container.clientWidth;
    const winHeight = container.clientHeight - 200;
    const factors: number[] = [];

    // Создаем 6 элементов
    for (let i = 0; i < 6; i++) {
      const element = document.createElement("div");
      element.className = "element";

      // Случайная позиция
      const x = Math.floor(Math.random() * winWidth);
      const y = Math.floor(Math.random() * winHeight);

      element.style.left = x + "px";
      element.style.top = y + "px";

      const background = container.querySelector(".background");
      if (background) {
        background.appendChild(element);
      }

      // Случайный фактор для движения
      const factor = Math.random() * 0.5 + 0.5;
      factors.push(factor);
    }

    // Предотвращение перекрытия
    const preventOverlap = () => {
      const elements = container.querySelectorAll(".element");
      elements.forEach((elem1, i) => {
        elements.forEach((elem2, j) => {
          if (i === j) return;

          const rect1 = elem1.getBoundingClientRect();
          const rect2 = elem2.getBoundingClientRect();

          const overlap = !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
          );

          if (overlap) {
            const newX = Math.floor(Math.random() * winWidth);
            const newY = Math.floor(Math.random() * winHeight);
            (elem1 as HTMLElement).style.left = newX + "px";
            (elem1 as HTMLElement).style.top = newY + "px";
          }
        });
      });
    };

    preventOverlap();

    // Обработчик движения мыши
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.pageX - winWidth / 2;
      const mouseY = e.pageY - winHeight / 2;

      const elements = container.querySelectorAll(".element");
      elements.forEach((element, index) => {
        const factor = factors[index];

        let newX = mouseX * factor;
        let newY = mouseY * factor;

        // Ограничиваем движение
        newX = Math.max(-100, Math.min(100, newX));
        newY = Math.max(-100, Math.min(100, newY));

        (
          element as HTMLElement
        ).style.transform = `translate(${newX}px, ${newY}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      // Удаляем созданные элементы
      const elements = container.querySelectorAll(".element");
      elements.forEach((element) => element.remove());
    };
  }, []);

  return (
    <>
      {/* Элементы для анимации */}
      <div className="background  " id="container">
        <div className="content">
          <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col no-hover">
              <div className="codewars-profile">
                <Image
                  src="/images/svg/codewars.svg"
                  alt="Codewars logo"
                  width={128}
                  height={128}
                />
                <div className="codewars-info">
                  <h3>{codewarsData?.username || "Username"}</h3>
                  <p className="codewars-rank pt-2">
                    Rank: {codewarsData?.ranks?.overall?.name || "5 kyu"}
                  </p>
                  <p className="codewars-honor">
                    Honor: {codewarsData?.honor || "1234"}
                  </p>
                  <p className="codewars-challenges">
                    Challenges:{" "}
                    {codewarsData?.codeChallenges?.totalCompleted || "1234"}
                  </p>
                  <a href="https://codewars.com/users/Arsenij%20Kotikov">
                    <button className="cw-lc-btn mt-3">Профиль</button>
                  </a>
                </div>
              </div>
            </div>
            <div className="col no-hover mb-5">
              <div className="leetcode-profile">
                <Image
                  src="/images/svg/leetcode.svg"
                  alt="Leetcode logo"
                  width={128}
                  height={128}
                />
                <div className="leetcode-info">
                  <h3>kotru21</h3>
                  <p className="leetcode-Rank pt-2">
                    Rank: {leetcodeData?.ranking || "5 kyu"}
                  </p>
                  <p className="leetcode-EasySolved">
                    Easy: {leetcodeData?.easySolved || 0}/
                    {leetcodeData?.totalEasy || 0}
                  </p>
                  <p className="leetcode-MediumSolved">
                    Medium: {leetcodeData?.mediumSolved || 0}/
                    {leetcodeData?.totalMedium || 0}
                  </p>
                  <p className="leetcode-HardSolved">
                    Hard: {leetcodeData?.hardSolved || 0}/
                    {leetcodeData?.totalHard || 0}
                  </p>
                  <a href="https://leetcode.com/kotru21/">
                    <button className="cw-lc-btn mt-3">Профиль</button>
                  </a>
                </div>
              </div>
            </div>
            <div className="col no-hover pt-sm-5 p-lg-5">
              <div className="position-relative pt-sm-5">
                <div className="position-absolute bottom-0">
                  <h1>Stat</h1>
                  <p className="pt-3">Codewars и Leetcode</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
