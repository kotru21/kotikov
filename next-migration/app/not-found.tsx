"use client";

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="col-sm-4 m-auto">
        <div className="card not-found-card">
          <div className="card-body not-found-card-body">
            <Image
              src="/images/sub/404cat.webp"
              alt="404 Cat"
              width={400}
              height={400}
              className="not-found-image"
            />
            <h5 className="card-title not-found-title">
              <div className="container">
                <p className="glitch">404</p>
                <hr className="hr" />
              </div>
            </h5>
            <p className="card-text not-found-text">
              Кажется, что-то пошло не так.
            </p>
            <div className="text-center not-found-button-container">
              <Link
                href="/"
                className="btn btn-primary not-found-button">
                Вернуться на главную
              </Link>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .glitch {
          font-family: "Arial", sans-serif;
          font-weight: 900;
          font-size: 10rem;
          text-transform: uppercase;
          position: relative;
          text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
            0.025em 0.04em 0 #fffc00;
          animation: glitch 725ms infinite;
          margin: 0;
        }

        .glitch span {
          position: absolute;
          top: 0;
          left: 0;
        }

        .glitch span:first-child {
          animation: glitch 500ms infinite;
          color: #00fffc;
          z-index: -1;
        }

        .glitch span:last-child {
          animation: glitch 375ms infinite;
          color: #fc00ff;
          z-index: -2;
        }

        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
              0.025em 0.04em 0 #fffc00;
          }
          15% {
            text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
              0.025em 0.04em 0 #fffc00;
          }
          16% {
            text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
              -0.05em -0.05em 0 #fffc00;
          }
          49% {
            text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
              -0.05em -0.05em 0 #fffc00;
          }
          50% {
            text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
              0 -0.04em 0 #fffc00;
          }
          99% {
            text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
              0 -0.04em 0 #fffc00;
          }
          100% {
            text-shadow: -0.05em 0 0 #00fffc, -0.025em -0.04em 0 #fc00ff,
              -0.04em -0.025em 0 #fffc00;
          }
        }

        body {
          background: linear-gradient(
            -45deg,
            #ee7752,
            #e73c7e,
            #23a6d5,
            #23d5ab
          );
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
          margin: 0;
          padding: 0;
          min-height: 100vh;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .hr {
          border: 2px solid white;
          border-radius: 2px;
          margin: 2rem 0;
        }

        .card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 1rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
}
