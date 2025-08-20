import React from "react";
import { FlyingNyancat } from "@/features";

const HeaderNyancat: React.FC = () => {
  return (
    <>
      <FlyingNyancat
        size="xlarge"
        position={{ top: "20%", left: "-150px" }}
        animationName="nyancat-fly"
        animationDuration="15s"
        zIndex={1}
      />

      {/* Стили анимации */}
      <style jsx>{`
        @keyframes nyancat-fly {
          0% {
            transform: translateX(-150px) translateY(0px);
          }
          12.5% {
            transform: translateX(12.5vw) translateY(-40px);
          }
          25% {
            transform: translateX(25vw) translateY(0px);
          }
          37.5% {
            transform: translateX(37.5vw) translateY(40px);
          }
          50% {
            transform: translateX(50vw) translateY(0px);
          }
          62.5% {
            transform: translateX(62.5vw) translateY(-40px);
          }
          75% {
            transform: translateX(75vw) translateY(0px);
          }
          87.5% {
            transform: translateX(87.5vw) translateY(40px);
          }
          100% {
            transform: translateX(calc(100vw + 150px)) translateY(0px);
          }
        }
      `}</style>
    </>
  );
};

export default HeaderNyancat;
