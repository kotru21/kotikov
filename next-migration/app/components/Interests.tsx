"use client";

import React from "react";

export default function Interests() {
  return (
    <div className="content interests-container" id="interests">
      <h1 className="content-h1 pb-4">Изучаю</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        <div className="col">
          <div className="card">
            <span>
              <i
                className="bx bxs-cat interests-icon"></i>
            </span>
            <div className="card-body">
              <h2 className="card-title">Котики</h2>
              <p className="card-text pt-3">
                Лол, здесь нужно что-то объяснять? Котики классные.
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <span>
              <i
                className="bx bxs-microchip interests-icon"></i>
            </span>
            <div className="card-body">
              <h2 className="card-title">ИИ</h2>
              <p className="card-text pt-3">
                Нейро́нная сеть — математическая модель, а также её программное
                или аппаратное воплощение, построенная по принципу организации и
                функционирования биологических нейронных сетей — сетей нервных
                клеток живого организма.
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <span>
              <i
                className="bx bxl-bitcoin interests-icon"></i>
            </span>
            <div className="card-body">
              <h2 className="card-title">Блокчейн</h2>
              <p className="card-text pt-3">
                Блокчейн — новейшая технология, интерес к которой вырос вместе с
                популярностью криптовалют. Сегодня ее широко обсуждают не только
                в мире финансов.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
