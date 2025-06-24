"use client";

import React from "react";
import Image from "next/image";

export default function GitHub() {
  return (
    <div
      className="header content-header  "
      style={{
        background:
          "linear-gradient(rgba(255, 255, 0, 0), rgba(255, 255, 0, 0.5))",
      }}>
      <div className="content content-github-reffer">
        <div
          className="header content-header pb-lg-4 pb-5"
          style={{ overflow: "hidden", background: "rgb(0, 0, 0)" }}>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col-lg-3 no-hover">
              <div className="card">
                <div className="card-body m-auto">
                  <h2 className="card-title">{"// Кстати"}</h2>
                </div>
              </div>
            </div>
            <div className="col" style={{ background: "yellow" }}>
              <Image
                src="/images/svg/kate.svg"
                alt="Kate"
                width={400}
                height={400}
              />
            </div>
            <div className="col no-hover">
              <div className="card">
                <div className="card-body">
                  <div className="p-3 pb-0">
                    <h1 className="card-h1">GitHub</h1>
                    <p className="card-text pt-2 pb-3">
                      Большинство моих проектов есть на Github и имеют свободные
                      к использованию лицензии
                    </p>
                    <button
                      type="button"
                      className="stack-btn-2"
                      onClick={() => window.open("https://github.com/kotru21")}>
                      Клик
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Source code секция */}
      <div className="content" style={{ position: "relative" }}>
        <h1 className="content-h1 pb-4" style={{ paddingTop: "5rem" }}>
          Source <span className="h1-weak">code</span>
        </h1>
        <div className="card">
          <h1 style={{ paddingBottom: "clamp(0.5rem, 0.5vw, 30rem)" }}>
            <i className="bx bx-code"></i>Ага,
          </h1>
          <div className="card-body">
            <p
              className="card-text"
              style={{ paddingBottom: "clamp(1rem, 2vw, 30rem)" }}>
              Этот сайт имеет открытый исходный код. Хочешь его посмотреть?
              Кликни по кнопочке ниже.
            </p>
            <button
              type="button"
              className="stack-btn-2"
              onClick={() => window.open("https://github.com/kotru21/kotikov")}>
              Клик
            </button>
          </div>
        </div>
        <Image
          src="/images/pc_index/pingv.svg"
          alt="pingv"
          width={576}
          height={576}
          className="pingv"
        />
      </div>
    </div>
  );
}
