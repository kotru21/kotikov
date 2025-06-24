"use client";

import React from "react";
import Image from "next/image";

export default function GitHub() {
  return (
    <>
      {" "}
      <div className="content content-github-reffer">
        <div
          className="fire-background pb-lg-4 pb-5"
          style={{
            overflow: "hidden",
            position: "relative",
          }}>
          {" "}
          {/* Эффект пламени */}
          <div className="fire-container">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="fire-flame">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="125px"
                  height="189.864px"
                  viewBox="0 0 125 189.864">
                  <path
                    className="flame-main"
                    fill="#F36E21"
                    d="M76.553,186.09c0,0-10.178-2.976-15.325-8.226s-9.278-16.82-9.278-16.82s-0.241-6.647-4.136-18.465
                    c0,0,3.357,4.969,5.103,9.938c0,0-5.305-21.086,1.712-30.418c7.017-9.333,0.571-35.654-2.25-37.534c0,0,13.07,5.64,19.875,47.54
                    c6.806,41.899,16.831,45.301,6.088,53.985"
                  />
                  <path
                    className="flame-main one"
                    fill="#F6891F"
                    d="M61.693,122.257c4.117-15.4,12.097-14.487-11.589-60.872c0,0,32.016,10.223,52.601,63.123
                    c20.585,52.899-19.848,61.045-19.643,61.582c0.206,0.537-19.401-0.269-14.835-18.532S57.576,137.656,61.693,122.257z"
                  />
                  <path
                    className="flame-main two"
                    fill="#FFD04A"
                    d="M81.657,79.192c0,0,11.549,24.845,3.626,40.02c-7.924,15.175-21.126,41.899-0.425,64.998
                    C84.858,184.21,125.705,150.905,81.657,79.192z"
                  />
                  <path
                    className="flame-main three"
                    fill="#FDBA16"
                    d="M99.92,101.754c0,0-23.208,47.027-12.043,80.072c0,0,32.741-16.073,20.108-45.79
                    C95.354,106.319,99.92,114.108,99.92,101.754z"
                  />
                  <path
                    className="flame-main four"
                    fill="#F36E21"
                    d="M103.143,105.917c0,0,8.927,30.753-1.043,46.868c-9.969,16.115-14.799,29.041-14.799,29.041
                    S134.387,164.603,103.143,105.917z"
                  />
                  <path
                    className="flame-main five"
                    fill="#FDBA16"
                    d="M62.049,104.171c0,0-15.645,67.588,10.529,77.655C98.753,191.894,69.033,130.761,62.049,104.171z"
                  />
                  <path
                    className="flame"
                    fill="#F36E21"
                    d="M101.011,112.926c0,0,8.973,10.519,4.556,16.543C99.37,129.735,106.752,117.406,101.011,112.926z"
                  />
                  <path
                    className="flame one"
                    fill="#F36E21"
                    d="M55.592,126.854c0,0-3.819,13.29,2.699,16.945C64.038,141.48,55.907,132.263,55.592,126.854z"
                  />
                  <path
                    className="flame two"
                    fill="#F36E21"
                    d="M54.918,104.595c0,0-3.959,6.109-1.24,8.949C56.93,113.256,52.228,107.329,54.918,104.595z"
                  />
                </svg>
              </div>
            ))}
          </div>
          <div
            className="row row-cols-1 row-cols-md-3 g-4"
            style={{
              position: "relative",
              zIndex: 1,
              justifyContent: "space-around",
            }}>
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
    </>
  );
}
