# Experience Section — Design Spec

**Дата:** 2026-06-30  
**Статус:** Утверждён (brainstorming)  
**Область:** Секция `#experience` — контент, вёрстка, визуальный стиль и архитектура виджета Timeline

## Цель

Переработать секцию «Опыт» так, чтобы посетитель за **10–15 секунд** считывал карьерную траекторию: **образование → работа → хакатоны**. Убрать личные проекты из таймлайна (они остаются в секции Projects), упростить визуальный шум (без карточек), усилить навигацию по этапам через подписанные step chips вместо точек.

## Сводка решений

| Тема | Решение |
| ---- | ------- |
| Состав данных | 4 этапа: 2 хакатона, 1 образование, 1 работа; проекты (id 3, 5, 6) удалены |
| Навигация | Карусель без зацикливания, 4 слайда, свайп, счётчик `1/4`, step chips `{год} · {тип}` |
| Год (decade-cat) | Сохранить, уменьшить ~на 60%, поднять выше |
| Контент слайда | Типографика + цветные метки типа; без карточек и без ссылок на Projects в v1 |
| Заголовок секции | `SectionHeader` на всю ширину; левая колонка сетки ~`18rem` |
| Подзаголовок | «Образование, работа и хакатоны» |

## Текущее состояние

- Данные: `src/shared/config/content/timeline.ts` — 7 записей, включая 3 `type: "project"`.
- Виджет: `src/widgets/timeline/ui/TimelineView.tsx` — карусель с точками-табами, сетка `md:grid-cols-[22rem_…]` / `lg:grid-cols-[26rem_…]`.
- Слайд: `src/widgets/timeline/ui/TimelineSlideContent.tsx` — eyebrow `тип · период`, заголовок, компания, описание, tech pills, ссылка GitHub для проектов.
- Год: `TimelineYearDisplay.tsx` — `clamp(3.75rem, 20vw, 7.5rem)`, decade-cat во второй цифре года.
- Утилиты: `timelineUtils.ts` — `extractYear`, `getTypeLabel`, `parsePeriodStart`, decade-cat helpers.
- Тип: `src/entities/timeline/model/types.ts` — `TimelineItem` с `type: "work" | "education" | "project" | "hackathon"`.

## 1. Контент и данные

### 1.1 Удаление проектов

Из `timeline.ts` удалить записи с `id`: **3** (Web Messenger), **5** (Файловый менеджер), **6** (Tiktok Analyzer). Остаётся **4 записи** в хронологическом порядке (после сортировки по `parsePeriodStart`):

| id | title | company | type | period (новый) |
| -- | ----- | ------- | ---- | -------------- |
| 1 | ByChange Hackathon | ByChange | hackathon | `2023` |
| 2 | Высшее образование | БГУИР | education | `2024 — н.в.` |
| 4 | Frontend Developer | Innowise | work | `июн 2025 — ноя 2025` |
| 7 | MTS Hackathon | MTS | hackathon | `2026` |

Поля `githubUrl` в оставшихся записях отсутствуют. Тип `project` в union `TimelineItem["type"]` сохраняется для обратной совместимости типов, но в данных v1 не используется.

### 1.2 Унификация периодов

Единый стиль написания (строгое соответствие в `period`):

| Было | Стало |
| ---- | ----- |
| `2023` | `2023` |
| `2024 — наст. время` | `2024 — н.в.` |
| `июнь 2025 - Ноябрь 2025` | `июн 2025 — ноя 2025` |
| `2026` | `2026` |

Разделитель диапазона — длинное тире `—` (U+2014). Сокращения месяцев: `июн`, `ноя`. `н.в.` — без точки в конце аббревиатуры внутри строки периода.

`extractYear(period)` и `parsePeriodStart(period)` продолжают работать с новыми строками; тесты `timelineUtils.test.ts` обновить под новые формулировки.

### 1.3 Сокращённые описания (1–2 предложения)

| id | description |
| -- | ----------- |
| 1 | Фулстек-приложение для мониторинга здоровья: UI, работа с API и интеграция с бэкендом. |
| 2 | Обучение на факультете информационной безопасности БГУИР. |
| 4 | Разработка веб-приложений на React и TypeScript. Стажировка во фронтенд-команде Innowise. |
| 7 | Фулстек IaaS-платформа за сжатые сроки: API, UI, дашборды и интеграция с бэкендом. |

### 1.4 Заголовок секции

В `TimelineView` обновить `SectionHeader`:

- `eyebrow`: `"Опыт"` (без изменений)
- `title`: `"Мой путь"` (без изменений)
- `description`: `"Образование, работа и хакатоны"`

### 1.5 Связь с Projects

В v1 **не добавлять** перекрёстные ссылки из Experience в секцию Projects. Блок GitHub / «Подробнее» в `TimelineSlideContent` удаляется вместе с веткой `type === "project"`.

---

## 2. Вёрстка и навигация

### 2.1 Структура DOM

```
Section (#experience)
├── SectionHeader          ← full-width, вне сетки
└── div[grid md+]          ← md:grid-cols-[18rem_minmax(0,1fr)]
    ├── aside (левая колонка)
    │   ├── TimelineYearDisplay
    │   ├── TimelineStepChips
    │   └── nav (стрелки + счётчик)
    └── main (правая колонка)
        └── tabpanel → TimelineSlideContent × 4 (stacked, один активный)
```

`SectionHeader` размещается **над** сеткой, на полную ширину контентной полосы (`max-w-5xl`), не внутри узкой левой колонки.

### 2.2 Сетка и брейкпоинты

- Контентная полоса: `mx-auto w-full max-w-5xl` (как у Skills).
- `md+`: `grid md:grid-cols-[18rem_minmax(0,1fr)] md:gap-6 md:items-stretch`.
- Убрать `lg:grid-cols-[26rem_…]` — единая левая колонка `18rem` на всех `md+`.
- Правая колонка: `min-w-0`, вертикальное центрирование контента слайда.

### 2.3 Порядок блоков

**Mobile (`< md`)** — вертикальный стек:

1. `SectionHeader`
2. `TimelineYearDisplay` (центрирован)
3. `TimelineStepChips` (горизонтальный скролл)
4. Навигация: стрелки + счётчик `N / 4`
5. Контент активного слайда

**Desktop (`md+`)**:

1. `SectionHeader` (full-width)
2. Двухколоночная сетка: слева год + chips + навигация; справа контент

### 2.4 Карусель

| Поведение | Значение |
| --------- | -------- |
| Слайдов | 4 |
| Зацикливание | Нет — на первом/последнем стрелки `disabled` |
| Свайп | Сохранить `SWIPE_THRESHOLD_PX` из `@/shared/lib/gestures` |
| Счётчик | `{activeIndex + 1} / 4`, `aria-live="polite"` |
| Клавиатура | `ArrowLeft` / `ArrowRight`, `Home` → 0, `End` → 3 |
| Неактивные слайды | `inert`, `aria-hidden={true}`, `pointer-events-none`, `invisible`, `opacity-0` |
| ARIA | `aria-roledescription="carousel"` на обёртке; chips — `role="tablist"`, слайд — `role="tabpanel"` |

Логика индекса, свайпа и клавиатуры выносится в хук `useTimelineCarousel` (см. §4).

### 2.5 Step chips (`TimelineStepChips`)

Заменяют текущие точки-табы в `TimelineView`.

**Формат подписи:** `{год} · {тип}`

- `{год}` = `extractYear(entry.period)` (например `2023`, `2024`, `2025`, `2026`)
- `{тип}` = `getTypeLabel(entry.type)` → `Работа` | `Обучение` | `Хакатон`

Примеры: `2023 · Хакатон`, `2024 · Обучение`, `2025 · Работа`, `2026 · Хакатон`.

**Mobile:**

- Контейнер: `overflow-x-auto`, `snap-x snap-mandatory`, `[scrollbar-width:none]`, скрытый webkit-scrollbar
- Каждый chip: `snap-center shrink-0`
- Горизонтальный скролл к активному chip при смене слайда (`scrollIntoView({ inline: "nearest", behavior })`, `behavior: "auto"` при `reducedMotion`)

**Desktop (`md+`):**

- Chips в левой колонке: **вертикальный список** `flex flex-col gap-2`, выравнивание `items-stretch`
- Горизонтальный `snap-x` скролл — только на `< md`

**Размеры и a11y:**

- `min-h-11` (44px touch target)
- `role="tab"`, `aria-selected`, `aria-controls`, `id="timeline-tab-{id}"`
- `focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none`

---

## 3. Визуальный стиль

Согласовано с mint-палитрой проекта и neo-brutalist эстетикой (ui-ux-pro-max).

### 3.1 Цвета типов (`timelineTypeStyles.ts`)

| type | Метка | Стили eyebrow (border-l + фон) | Акцент chip (активный) |
| ---- | ----- | ------------------------------ | ---------------------- |
| `work` | Работа | `border-l-4 border-primary-500 pl-3` | `bg-primary-500 text-white` |
| `education` | Обучение | `border-l-4 border-neutral-400 bg-neutral-100 pl-3 dark:border-neutral-500 dark:bg-neutral-800` | `bg-neutral-200 text-text-primary dark:bg-neutral-700 dark:text-text-inverse` |
| `hackathon` | Хакатон | `border-l-4 border-primary-300 bg-primary-100 pl-3 dark:border-primary-700 dark:bg-primary-950` | `bg-primary-100 text-primary-950 dark:bg-primary-900 dark:text-primary-100` |

Экспорт: `getTimelineTypeEyebrowClass(type)`, `getTimelineTypeChipClass(type, isActive)`.

### 3.2 Контент слайда (`TimelineSlideContent`)

Без карточной обёртки — только типографика на фоне секции.

| Элемент | Классы |
| ------- | ------ |
| Eyebrow (только тип) | `text-xs font-bold tracking-[0.22em] uppercase` + `getTimelineTypeEyebrowClass` |
| Заголовок | `text-3xl md:text-4xl font-black tracking-tight uppercase text-text-primary dark:text-text-inverse` |
| Компания | `mt-1 text-sm font-bold text-primary-950 dark:text-primary-300` |
| Описание | `mt-4 text-sm md:text-base font-medium leading-relaxed text-text-secondary dark:text-neutral-300` |
| Tech pills | Как `SkillsGroupedTags`: `bg-background-primary border border-black px-2 py-1 text-xs font-bold text-text-primary dark:border-white dark:bg-neutral-900 dark:text-text-inverse` |

Период **не** дублируется в eyebrow слайда — только в step chip.

### 3.3 Step chips — состояния

**Неактивный:**

```
border-2 border-black bg-white text-text-primary
dark:border-white dark:bg-black dark:text-text-inverse
```

**Активный (neo-brutalist):**

```
border-2 border-black bg-white shadow-[4px_4px_0_0_#000]
dark:border-white dark:bg-black dark:shadow-[4px_4px_0_0_#fff]
```

+ цветовой акцент типа из §3.1 для фона активного chip (поверх базового `bg-white` / dark-варианта).

**Transition:** `transition-[box-shadow,background-color] duration-200`; при `reducedMotion` — `duration-0`.

### 3.4 Навигационные стрелки

- Размер кнопки: `size-11` (было `size-9`)
- Иконка: `size-5`
- Стиль: сохранить neo-brutalist `border-2`, `disabled:opacity-30`

### 3.5 Decade-cat год (`TimelineYearDisplay`)

- Размер цифр: `clamp(2.25rem, 12vw, 4.5rem)` (~60% от текущего `clamp(3.75rem, 20vw, 7.5rem)`)
- Контейнер в левой колонке: уменьшить вертикальный отступ, `items-start` / `justify-center` — визуально ближе к заголовку секции
- Логика decade-cat без изменений

### 3.6 Фокус и reduced motion

- Все интерактивные элементы: `focus-visible:ring-2 focus-visible:ring-primary-500`
- `usePerformanceSettings().reducedMotion`:
  - Отключить `transition` на chips и смене слайда
  - `scrollIntoView` для chips — `behavior: "auto"`

---

## 4. Архитектура

### 4.1 Новые файлы

| Файл | Назначение |
| ---- | ---------- |
| `src/widgets/timeline/ui/timelineTypeStyles.ts` | Классы eyebrow и chip по `TimelineItem["type"]` |
| `src/widgets/timeline/ui/TimelineStepChips.tsx` | Список step chips, scroll-snap на mobile |
| `src/widgets/timeline/hooks/useTimelineCarousel.ts` | Состояние карусели, goTo/Prev/Next, touch, keyboard |

### 4.2 Изменяемые файлы

| Файл | Изменения |
| ---- | --------- |
| `src/shared/config/content/timeline.ts` | 4 записи, новые period/description |
| `src/widgets/timeline/ui/TimelineSlideContent.tsx` | Eyebrow только тип; tech pills; убрать GitHub |
| `src/widgets/timeline/ui/TimelineView.tsx` | Layout, SectionHeader full-width, chips, hook |
| `src/widgets/timeline/ui/TimelineYearDisplay.tsx` | Новый clamp размера |
| `tests/shared/content.test.ts` | Ассерты на timeline |
| `tests/widgets/timelineUtils.test.ts` | Периоды `н.в.`, `июн`/`ноя` |

### 4.3 Хук `useTimelineCarousel`

**Расположение:** `src/widgets/timeline/hooks/useTimelineCarousel.ts`

**Вход:** `itemCount: number`

**Возвращает:**

```ts
{
  activeIndex: number;
  goTo: (index: number) => void;
  goPrev: () => void;
  goNext: () => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  handleTouchStart: (event: React.TouchEvent) => void;
  handleTouchEnd: (event: React.TouchEvent) => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}
```

`activeItem` вычисляется в `TimelineView` как `timelineData[activeIndex]`. Паттерн: чистые `useCallback` / `useState`, без новых зависимостей. Сортировка данных остаётся в `TimelineView` через `useMemo`.

### 4.4 Порядок миграции

1. **Данные** — `timeline.ts`
2. **Стили типов** — `timelineTypeStyles.ts`
3. **Chips** — `TimelineStepChips.tsx`
4. **Хук** — `useTimelineCarousel.ts`
5. **Слайд** — `TimelineSlideContent.tsx`
6. **Вид** — `TimelineView.tsx` + `TimelineYearDisplay.tsx`
7. **Тесты** — `content.test.ts`, `timelineTypeStyles.test.ts`, `TimelineStepChips.test.tsx`, обновление `timelineUtils.test.ts`

---

## 5. Тестирование

### 5.1 `tests/shared/content.test.ts`

Добавить describe-блок `timeline data`:

- `timelineData` содержит ровно **4** записи
- Ни одна запись не имеет `type: "project"`
- id записей: `[1, 2, 4, 7]`
- Периоды строго: `2023`, `2024 — н.в.`, `июн 2025 — ноя 2025`, `2026`
- У каждой записи: непустые `title`, `company`, `description`, `technologies.length >= 1`

### 5.2 `tests/widgets/timelineTypeStyles.test.ts`

| type | eyebrow содержит | active chip содержит |
| ---- | ---------------- | -------------------- |
| `work` | `border-primary-500` | `bg-primary-500` |
| `education` | `bg-neutral-100` | `bg-neutral-200` |
| `hackathon` | `bg-primary-100` | `bg-primary-100` |

### 5.3 `tests/widgets/TimelineStepChips.test.tsx`

- Рендер 4 chips с подписями `2023 · Хакатон`, …
- Клик по chip вызывает `onSelect(index)`
- Активный chip имеет `aria-selected="true"`
- `role="tablist"` на контейнере

### 5.4 `tests/widgets/timelineUtils.test.ts`

Обновить фикстуры:

- `extractYear("2024 — н.в.")` → `"2024"`
- `parsePeriodStart("июн 2025 — ноя 2025")` → `2025 * 12 + 6`

### 5.5 Ручная проверка (QA)

- [ ] Скан траектории за ~10–15 с: типы и годы читаются с первого взгляда
- [ ] 4 слайда, нет wrap на краях
- [ ] Свайп влево/вправо на mobile
- [ ] Chips скроллятся с snap на mobile; вертикальный список на desktop
- [ ] `inert` на неактивных слайдах — Tab не фокусирует скрытый контент
- [ ] Decade-cat ~60% меньше, позиция выше
- [ ] Dark mode: контраст типов и chips
- [ ] `prefers-reduced-motion`: без анимаций перехода
- [ ] Клавиатура: стрелки, Home/End на tablist
- [ ] Секция `#experience` в навигации без регрессий (`home-order.test.tsx`)

---

## 6. Вне области (v1)

- Перекрёстные ссылки Experience ↔ Projects
- Возврат личных проектов в таймлайн
- Зацикливание карусели
- Framer Motion или иные новые animation-зависимости
- Фильтрация по типу (табы «только работа» и т.п.)

## Ссылки

- Текущие данные: `src/shared/config/content/timeline.ts`
- Виджет: `src/widgets/timeline/ui/TimelineView.tsx`
- Референс tech pills: `src/widgets/skills/ui/SkillsGroupedTags.tsx`
- Паттерн design spec: `docs/superpowers/specs/2026-06-16-dynamic-island-navbar-design.md`
