"use client";

import React from "react";

export default function TechStack() {
  return (
    <div className="my-projects" style={{ overflow: "hidden" }}>
      <div className="content pt-5 ">
        <h1 className="content-h1">
          <span className="h1-weak">Мой</span>
          <br />
          стек
        </h1>

        {/* Солнечная система */}
        <div>
          <section id="solar-system">
            <div id="sun"></div>
            <article id="mercury-trajectory">
              <div id="mercury">
                <i className="bx bxl-javascript"></i>
              </div>
            </article>
            <article id="venus-trajectory">
              <div id="venus">
                <i className="bx bxl-javascript"></i>
              </div>
            </article>
            <article id="earth-trajectory">
              <div id="earth">
                <i className="bx bxl-javascript"></i>
              </div>
            </article>
            <article id="mars-trajectory">
              <div id="mars">
                <i className="bx bxl-javascript"></i>
              </div>
            </article>
            <article id="main-asteroid-belt-trajectory"></article>
            <article id="jupiter-trajectory"></article>
            <article id="saturn-trajectory"></article>
            <article id="uranus-trajectory"></article>
            <article id="neptune-trajectory"></article>
          </section>
        </div>

        {/* Карточки технологий */}
        <div className="row row-cols-1 row-cols-md-3 g-4" id="code-stack">
          <div className="col">
            <div className="card">
              <h1 className="card-h1">
                <i className="bx bxl-javascript"></i>JS
              </h1>
              <div className="card-body">
                <h2 className="card-title">JavaScript</h2>
                <p className="card-text pt-3">
                  JavaScript это язык, который позволяет вам применять сложные
                  вещи на web странице.
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <h1 className="card-h1">
                <i className="bx bxl-html5"></i>HTML / CSS
              </h1>
              <div className="card-body">
                <h2 className="card-title">Hyper Text Markup Language</h2>
                <p className="card-text pt-3">
                  Язык гипертекстовой разметки страницы. Он используется для
                  того, чтобы дать браузеру понять, как нужно отображать
                  загруженный сайт. Cascading Style Sheets — формальный язык
                  описания внешнего вида web страницы.
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <h1 className="card-h1">
                <i className="bx bx-server"></i>PHP / Node
              </h1>
              <div className="card-body">
                <h2 className="card-title">PHP / Node.js</h2>
                <p className="card-text pt-3">
                  PHP - C-подобный скриптовый язык общего назначения, интенсивно
                  применяемый для разработки веб-приложений.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TODO секция */}
      <div className="todo">
        <div className="content pt-5">
          <h1 className="content-h1 inverted pb-4">TODO</h1>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col">
              <div className="card">
                <h1 className="card-h1 inverted">
                  <i className="bx bxl-c-plus-plus inverted"></i>C++
                </h1>
                <div className="card-body">
                  <h2 className="card-title inverted">Си плас плас</h2>
                  <p className="card-text inverted pt-3">
                    Объекто-ориентированный язык программирования промежуточного
                    уровня
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <h1 className="card-h1 inverted">
                  <i className="bx bxl-google inverted"></i>GO
                </h1>
                <div className="card-body">
                  <h2 className="card-title inverted">Golang</h2>
                  <p className="card-text inverted pt-3">
                    Go представляет компилируемый статически типизированный язык
                    программирования от компании Google.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
