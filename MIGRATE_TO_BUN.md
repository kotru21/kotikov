Миграция проекта с npm на Bun

Коротко:
- Я добавил в `package.json` поле `"packageManager": "bun@1.x"`.
- Удалил `package-lock.json` и установил зависимости через `bun install`.
- Сгенерирован и закоммичен `bun.lock`.

Локально (рекомендуемые шаги):
1. Установить Bun — инструкции: https://bun.sh/install
   - На Windows можно использовать `winget install bun` или официальный установщик с сайта.
   - В WSL/Unix: `curl -fsSL https://bun.sh/install | bash`.
2. Удалить старые артефакты (если нужно):
   - `rm -f package-lock.json` (или `del package-lock.json` в PowerShell)
   - `rm -rf node_modules`
3. Установить зависимости через Bun:
   - `bun install`
4. Запуск скриптов проекта (как раньше, но через Bun):
   - `bun run dev`
   - `bun run build`
   - `bun run start`

Примечания:
- Vercel уже настроен на Bun (`vercel.json` содержит `"bunVersion": "1.x"`).
- Большинство `npm`-скриптов остаются без изменений — Bun умеет запускать команды из `package.json`.
- Если у вас есть CI/другие окружения, обновите шаги инсталляции на `bun install` и/или установите Bun там.

Если хотите, могу:
- Обновить CI (GitHub Actions / других) чтобы явно использовать Bun.
- Заменить в коде/скриптах использование `npx` на `bunx` где нужно.
- Запустить тесты/локальные проверки в этом окружении.
