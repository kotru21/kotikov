"use client";

import Link from "next/link";
import React from "react";

import { FlyingNyancat } from "@/features/nyancat";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { colors } from "@/styles/colors";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div
          style={{
            clipPath: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)",
          }}
          className="aspect-square w-96 bg-linear-to-br from-purple-400/20 to-pink-400/20 rotate-45"
        />
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-4 text-center">
        <Card
          variant="bgNone"
          padding="lg"
          className="max-w-2xl mx-auto">
          {/* 404 в большом размере */}
          <div
            className="text-8xl md:text-9xl font-bold mb-8"
            style={{ color: colors.primary[600] }}>
            404
          </div>

          {/* Заголовок */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Страница не найдена
          </h1>

          {/* Описание */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            К сожалению, запрашиваемая страница не существует или была
            перемещена.
            <br />
            Давайте вернем вас на правильный путь!
          </p>

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-8">
                🏠 На главную
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8"
              onClick={() => window.history.back()}>
              ← Назад
            </Button>
          </div>

          {/* Дополнительные ссылки */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Может быть, вас заинтересует:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/#skills"
                className="text-primary-600 hover:text-primary-700 transition-colors duration-200">
                Навыки
              </Link>
              <Link
                href="/#timeline"
                className="text-primary-600 hover:text-primary-700 transition-colors duration-200">
                Опыт работы
              </Link>
              <Link
                href="/#contacts"
                className="text-primary-600 hover:text-primary-700 transition-colors duration-200">
                Контакты
              </Link>
            </div>
          </div>
        </Card>

        {/* Анимированные элементы */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-accent-pink-400 rounded-full animate-bounce opacity-60" />
        <div className="absolute top-20 right-20 w-6 h-6 bg-accent-blue-400 rounded-full animate-pulse opacity-60" />
        <div
          className="absolute bottom-20 left-20 w-5 h-5 bg-accent-purple-400 rounded-full animate-bounce opacity-60"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-10 right-10 w-3 h-3 bg-primary-400 rounded-full animate-pulse opacity-60"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Летающие нянкэты */}
      <FlyingNyancat
        size="large"
        position={{ top: "15%", left: "-120px" }}
        animationName="nyancat-fly-404-1"
        animationDuration="20s"
        animationDelay="0s"
        zIndex={-5}
      />

      <FlyingNyancat
        size="medium"
        position={{ top: "60%", left: "-80px" }}
        animationName="nyancat-fly-404-2"
        animationDuration="25s"
        animationDelay="8s"
        zIndex={-5}
      />

      <FlyingNyancat
        size="small"
        position={{ top: "80%", left: "-60px" }}
        animationName="nyancat-fly-404-3"
        animationDuration="18s"
        animationDelay="12s"
        zIndex={-5}
      />

      <FlyingNyancat
        size="small"
        position={{ top: "35%", left: "-40px" }}
        animationName="nyancat-fly-404-4"
        animationDuration="22s"
        animationDelay="5s"
        zIndex={-5}
      />

      {/* Стили анимации для летающих нянкэтов */}
      <style jsx>{`
        @keyframes nyancat-fly-404-1 {
          0% {
            transform: translateX(-120px) translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateX(25vw) translateY(-60px) rotate(5deg);
          }
          50% {
            transform: translateX(50vw) translateY(40px) rotate(-3deg);
          }
          75% {
            transform: translateX(75vw) translateY(-30px) rotate(7deg);
          }
          100% {
            transform: translateX(calc(100vw + 120px)) translateY(0px)
              rotate(0deg);
          }
        }

        @keyframes nyancat-fly-404-2 {
          0% {
            transform: translateX(-80px) translateY(0px) rotate(0deg);
          }
          20% {
            transform: translateX(20vw) translateY(50px) rotate(-8deg);
          }
          40% {
            transform: translateX(40vw) translateY(-40px) rotate(5deg);
          }
          60% {
            transform: translateX(60vw) translateY(30px) rotate(-4deg);
          }
          80% {
            transform: translateX(80vw) translateY(-50px) rotate(6deg);
          }
          100% {
            transform: translateX(calc(100vw + 80px)) translateY(0px)
              rotate(0deg);
          }
        }

        @keyframes nyancat-fly-404-3 {
          0% {
            transform: translateX(-60px) translateY(0px) rotate(0deg);
          }
          30% {
            transform: translateX(30vw) translateY(-70px) rotate(10deg);
          }
          60% {
            transform: translateX(60vw) translateY(20px) rotate(-5deg);
          }
          100% {
            transform: translateX(calc(100vw + 60px)) translateY(0px)
              rotate(0deg);
          }
        }

        @keyframes nyancat-fly-404-4 {
          0% {
            transform: translateX(-40px) translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateX(33vw) translateY(80px) rotate(-12deg);
          }
          66% {
            transform: translateX(66vw) translateY(-45px) rotate(8deg);
          }
          100% {
            transform: translateX(calc(100vw + 40px)) translateY(0px)
              rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
