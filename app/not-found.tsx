import Link from "next/link";

import BackButton from "@/app/components/BackButton";
import BauhausErrorMark from "@/app/components/BauhausErrorMark";
import { Button, Card } from "@/shared/ui";

export default function NotFound(): React.JSX.Element {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="from-accent-300 to-accent-700 relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="from-accent-300 to-accent-700 relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)",
          }}
          className="from-accent-200/20 to-accent-600/20 aspect-square w-96 rotate-45 bg-linear-to-br"
        />
      </div>

      <div className="container mx-auto px-4 text-center">
        <Card variant="bgNone" padding="lg" className="mx-auto max-w-2xl">
          <BauhausErrorMark code="404" />

          <h1 className="text-text-primary dark:text-text-inverse mb-4 text-3xl font-bold md:text-4xl">
            Страница не найдена
          </h1>

          <p className="text-text-secondary mb-8 text-lg leading-relaxed md:text-xl dark:text-neutral-300">
            К сожалению, запрашиваемая страница не существует или была перемещена.
            <br />
            Давайте вернем вас на правильный путь!
          </p>

          <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4 sm:max-w-none sm:flex-row">
            <div className="w-full sm:w-auto">
              <Button href="/" variant="primary" size="lg" fullWidth>
                На главную
              </Button>
            </div>

            <div className="w-full sm:w-auto">
              <BackButton />
            </div>
          </div>

          <div className="mt-12 border-t border-black/20 pt-8 dark:border-white/20">
            <p className="text-text-muted mb-4 text-sm dark:text-neutral-400">
              Может быть, вас заинтересует:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/#skills"
                className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                Навыки
              </Link>
              <Link
                href="/#experience"
                className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                Опыт работы
              </Link>
              <Link
                href="/#contacts"
                className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                Контакты
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
