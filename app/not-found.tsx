"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui";
import { Card } from "@/app/components/ui";
import { colors } from "@/app/styles/colors";

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

      {/* Дополнительные элементы фона для более красивого эффекта */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div
          style={{
            clipPath: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)",
          }}
          className="aspect-square w-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rotate-45"
        />
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-4 text-center">
        <Card
          variant="bgNone"
          padding="lg"
          className="max-w-2xl mx-auto backdrop-blur-sm">
          {/* 404 в большом размере */}
          <div
            className={`text-8xl md:text-9xl font-bold mb-8 text-${colors.primary[600]}`}>
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
    </div>
  );
};

export default NotFound;
