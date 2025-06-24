"use client";

import React from "react";

export default function Footer() {
  return (
    <div>
      <footer className="text-center" style={{ backgroundColor: "#f1f1f1" }}>
        {/* Grid container */}
        <div className="container pt-4">
          {/* Section: Social media */}
          <section>
            <a
              className="btn"
              href="https://youtube.com/@kotikov"
              role="button"
              data-mdb-ripple-color="dark">
              <i className="footer bx bxl-youtube inverted"></i>
            </a>

            <a
              className="btn"
              href="https://twitter.com/arsenij_kotikov"
              role="button"
              data-mdb-ripple-color="dark">
              <i className="footer bx bxl-twitter inverted"></i>
            </a>

            <a
              className="btn"
              href="https://github.com/kotru21"
              role="button"
              data-mdb-ripple-color="dark">
              <i className="footer bx bxl-github inverted"></i>
            </a>

            <a
              className="btn"
              href="mailto:kotikovv@proton.me"
              role="button"
              data-mdb-ripple-color="dark">
              <i className="footer bx bxl-gmail inverted"></i>
            </a>

            <a
              className="btn"
              href="https://vk.com/arsenij_kotikov"
              role="button"
              data-mdb-ripple-color="dark">
              <i className="footer bx bxl-vk inverted"></i>
            </a>

            <a
              className="btn"
              href="https://instagram.com/arsenij_kotikov"
              role="button"
              data-mdb-ripple-color="dark">
              <i className="footer bx bxl-instagram inverted"></i>
            </a>

            {/* Section: Social media */}

            {/* Grid container */}

            {/* Copyright */}
            <div
              className="text-center text-dark p-3"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
              © 2023 Copyright:
              <a className="text-dark" href="https://kotikov.is-a.dev/">
                kotikov
              </a>
            </div>
            {/* Copyright */}
          </section>
        </div>
      </footer>
    </div>
  );
}
