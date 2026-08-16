import Link from "next/link";

import BackButton from "@/app/components/BackButton";
import { GridErrorMark } from "@/app/components/GridErrorMark";
import { Button, GRID_STROKE, GRID_TYPE } from "@/shared/ui";

const ERROR_CANVAS = "bg-[#f5f5f3] dark:bg-[#0a0a0a]";

function NotFoundActions(): React.JSX.Element {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4 sm:max-w-none sm:flex-row">
      <div className="w-full sm:w-auto">
        <Button href="/" variant="primary" size="lg" fullWidth className="text-[#111]">
          На главную
        </Button>
      </div>
      <div className="w-full sm:w-auto">
        <BackButton />
      </div>
    </div>
  );
}

function NotFoundSuggestions(): React.JSX.Element {
  return (
    <div className="mt-12 border-t-2 border-[#111] pt-8 dark:border-[#ededed]">
      <p className={`${GRID_TYPE} mb-4 text-sm`}>Может быть, вас заинтересует:</p>
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <Link href="/#skills" className={`${GRID_TYPE} underline-offset-4 hover:underline`}>
          Навыки
        </Link>
        <Link href="/#experience" className={`${GRID_TYPE} underline-offset-4 hover:underline`}>
          Опыт работы
        </Link>
        <Link href="/#contacts" className={`${GRID_TYPE} underline-offset-4 hover:underline`}>
          Контакты
        </Link>
      </div>
    </div>
  );
}

export default function NotFound(): React.JSX.Element {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`${ERROR_CANVAS} ${GRID_TYPE} flex min-h-screen items-center justify-center ${GRID_STROKE}`}
    >
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center px-4 text-center">
        <GridErrorMark code="404" />
        <h1
          className={`${GRID_TYPE} mb-4 text-3xl font-black tracking-[-0.05em] uppercase md:text-4xl`}
        >
          Страница не найдена
        </h1>
        <p className={`${GRID_TYPE} mb-8 text-lg leading-relaxed md:text-xl`}>
          К сожалению, запрашиваемая страница не существует или была перемещена.
          <br />
          Давайте вернем вас на правильный путь!
        </p>
        <NotFoundActions />
        <NotFoundSuggestions />
      </div>
    </main>
  );
}
