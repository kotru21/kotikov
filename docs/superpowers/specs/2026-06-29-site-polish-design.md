# Спецификация: полировка сайта kotikov (neobrutalist)

**Дата:** 2026-06-29  
**Статус:** утверждено  
**Подход:** Approach 1 — neobrutalist (сохраняем жёсткие тени, `border-2`, mint-акцент `#00ffb9`, uppercase-типографику). **Не** переходим к минималистичному портфолио.

---

## 1. Цели и границы

### 1.1 Цели

1. **Единый layout-контракт** — одинаковые отступы, ширина контейнера и вертикальный ритм во всех секциях.
2. **Предсказуемая адаптивность** — согласованные брейкпоинты; deck→grid в Projects на `md` (768px), а не `sm`.
3. **Иерархия neobrutalist** — типографика, тени, скругления и фоны приведены к единым правилам без потери характера сайта.
4. **Тёмная тема** — убрать ad-hoc цвета (`gray-*`, inline `style`, `dark:bg-[#0a0a0a]`) в пользу токенов из `src/shared/styles/colors.ts` и Tailwind-расширений.

### 1.2 Вне скоупа

- Новые секции или контент.
- Редизайн hero (`HeaderHero`, `HeaderWidget`).
- Миграция на shadcn/ui.
- AWWWARDS-анимации, parallax, новые интерактивы.
- Изменение логики nyancat, ContactCanvas, Skills marquee, Timeline carousel.
- Рефакторинг FSD-слоёв за пределами затронутых файлов.

### 1.3 Затрагиваемые области

| Область                    | Файлы                                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Примитивы                  | `src/shared/ui/Section/`, `src/shared/ui/SectionHeader/`, `src/shared/ui/index.ts`                                   |
| Виджеты                    | `AboutView`, `ProjectsView`, `SkillsDesktopView`, `SkillsMobileView`, `TimelineView`, `ContactsView`, `FooterWidget` |
| Сущности / UI              | `ProjectCard`, `Button`, `Card`                                                                                      |
| Страницы ошибок            | `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`                                                         |
| Конфиг (при необходимости) | `tailwind.config.ts`, `app/globals.css`                                                                              |
| Тесты                      | `tests/shared/section.test.tsx` (новый)                                                                              |

**Hero и Header** остаются без изменений layout-контракта; они не оборачиваются в `Section`.

---

## 2. Часть A+B: Layout Contract

### 2.1 Шкала отступов (база 8px)

Все значения — Tailwind-классы. Базовая единица: 8px (`1` = 4px, `2` = 8px, …).

| Токен               | Классы              | px      | Применение                                            |
| ------------------- | ------------------- | ------- | ----------------------------------------------------- |
| `section-y`         | `py-24`             | 96      | About, Projects, Experience (`#experience`), Contacts |
| `section-y-compact` | `py-16`             | 64      | Skills                                                |
| `container-x`       | `px-6 lg:px-8`      | 24 / 32 | Горизонтальный padding всех секций и Footer           |
| `container-max`     | `max-w-6xl mx-auto` | 1152    | Внутренний контейнер контента                         |
| `section-gap`       | `gap-12 lg:gap-16`  | 48 / 64 | Межколоночные и межблочные gap внутри секции          |
| `header-gap`        | `mb-12 lg:mb-16`    | 48 / 64 | Отступ под `SectionHeader` до основного контента      |

**Разрешение именования Experience / Timeline:** виджет `TimelineView` рендерит единственную секцию `<section id="experience">` (якорь навигации «Опыт»). В списке compact фигурирует «Timeline» как имя виджета, но padding секции определяется пунктом «Experience» → **`section-y` (`py-24`)**. Compact (`py-16`) применяется только к Skills. Внутренний carousel-band (`alignedContentBandClass`) сохраняет свою сетку; горизонтальный padding переносится на `Section` / `container-x`.

**Примечание по Contacts:** секция с градиентом/канвасом сохраняет `min-h-[70vh] md:min-h-[60vh]` и `overflow-hidden`. Вертикальный padding — `section-y` через `Section`; горизонтальный — `container-x` вместо `container mx-auto px-4`.

**Примечание по Footer:** `py-12` заменяется на `py-16` (компактнее основных секций, но согласовано с 8px-шкалой). Горизонталь — `container-x`, внутренний wrap — `container-max`.

### 2.2 Брейкпоинты

| Диапазон    | Tailwind         | Поведение                                                                                                                                  |
| ----------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Mobile      | `< md` (< 768px) | Одноколоночные layout; Projects — deck (`ProjectCardDeck`); Header — burger-меню                                                           |
| Tablet+     | `md:` (≥ 768px)  | Двухколоночные grid (About, Timeline); Projects — grid 2 col; Skills mobile/desktop переключение через `useIsMobile` (существующая логика) |
| Desktop nav | `lg:` (≥ 1024px) | Island-навигация (`HeaderNavigation` fixed island)                                                                                         |

**Исправление Projects:** заменить переключение deck/grid:

```tsx
// Было
<div className="sm:hidden">…deck…</div>
<div className="hidden … sm:grid sm:grid-cols-2 …">…grid…</div>

// Станет
<div className="md:hidden">…deck…</div>
<div className="hidden … md:grid md:grid-cols-2 …">…grid…</div>
```

`xl:grid-cols-3` для третьей колонки остаётся без изменений.

### 2.3 Примитив `Section`

**Путь:** `src/shared/ui/Section/Section.tsx`, `src/shared/ui/Section/index.ts`

```tsx
interface SectionProps {
  id: string;
  children: React.ReactNode;
  /** default = py-24, compact = py-16 */
  spacing?: "default" | "compact";
  /** Tailwind bg-классы; по умолчанию чередование см. таблицу миграции */
  backgroundClassName?: string;
  className?: string;
  /** Доп. классы на внутренний контейнер (max-w-6xl) */
  innerClassName?: string;
  as?: "section" | "footer";
}
```

**Поведение:**

- Корневой элемент: `<section>` или `<footer>` (для Footer).
- Корневые классы: `relative transition-colors duration-300`, `spacing`-класс, `backgroundClassName`, опциональный `className`.
- Внутренняя обёртка: `container-x` + `container-max` + `innerClassName`.
- `children` рендерятся внутри обёртки.
- Не добавляет `id` на внутренний div — `id` только на корне.

**Экспорт:** добавить в `src/shared/ui/index.ts`:

```ts
export { Section } from "./Section";
export { SectionHeader } from "./SectionHeader";
```

### 2.4 Примитив `SectionHeader`

**Путь:** `src/shared/ui/SectionHeader/SectionHeader.tsx`, `src/shared/ui/SectionHeader/index.ts`

```tsx
interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** left — по умолчанию; center — для Contacts */
  align?: "left" | "center";
  className?: string;
}
```

**Разметка и классы (Phase 1 — структура; Phase 2 — точные типо-классы из §3):**

```
<header className={header-gap + align}>
  <p className="eyebrow">…</p>
  <h2 className="…">…</h2>
  {description && <p className="description">…</p>}
</header>
```

- `align="left"`: `text-left`, без `mx-auto` на description.
- `align="center"`: `text-center`, description с `mx-auto max-w-xl`.
- Eyebrow в Contacts с интерактивной обёрткой (`InteractiveElement`) — `SectionHeader` принимает `eyebrow` как `React.ReactNode` **или** виджет передаёт кастомный `eyebrowSlot`. **Решение:** prop `eyebrow: React.ReactNode` для гибкости Contacts.

### 2.5 Таблица миграции виджетов

| Виджет           | Файл                                          | `id`         | spacing | background                                                                | Прочие изменения                                                                   |
| ---------------- | --------------------------------------------- | ------------ | ------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| About            | `src/widgets/about/ui/AboutView.tsx`          | `about`      | default | `bg-background-primary dark:bg-background-tertiary`                       | Grid: `section-gap`, `lg:grid-cols-[1.1fr_0.9fr]`; заголовок → `SectionHeader`     |
| Projects         | `src/widgets/projects/ui/ProjectsView.tsx`    | `projects`   | default | `bg-neutral-100 dark:bg-background-tertiary` (замена `dark:bg-[#0a0a0a]`) | `max-w-7xl` → `container-max`; deck/grid `md`; заголовок → `SectionHeader`         |
| Skills (desktop) | `src/widgets/skills/ui/SkillsDesktopView.tsx` | `skills`     | compact | `bg-background-primary dark:bg-background-tertiary`                       | Marquee без собственного заголовка — без `SectionHeader`                           |
| Skills (mobile)  | `src/widgets/skills/ui/SkillsMobileView.tsx`  | `skills`     | compact | то же                                                                     | Заголовок внутри — в Phase 2 привести к `SectionHeader` или eyebrow+H2 паттерну    |
| Experience       | `src/widgets/timeline/ui/TimelineView.tsx`    | `experience` | default | `bg-background-primary dark:bg-background-tertiary`                       | Убрать `alignedContentBandClass` px-4 → padding от `Section`; H2 в Phase 2         |
| Contacts         | `src/widgets/contacts/ui/ContactsView.tsx`    | `contacts`   | default | без фона на Section (градиент/канвас — absolute children)                 | `Section` + `innerClassName` для z-index; `SectionHeader align="center"`           |
| Footer           | `src/widgets/footer/FooterWidget.tsx`         | —            | —       | `bg-background-primary dark:bg-background-tertiary`                       | `Section as="footer"`, `spacing` не используется, `className="py-16 border-t-4 …"` |

### 2.6 Фоны секций (чередование)

Для визуального ритма без смены характера:

1. **About** — `background-primary` / `background-tertiary` (dark)
2. **Projects** — `neutral-100` / `background-tertiary` (dark)
3. **Skills** — `background-primary` / `background-tertiary`
4. **Experience** — `background-primary` / `background-tertiary`
5. **Contacts** — полноэкранный градиент (без смены)
6. **Footer** — `background-primary` / `background-tertiary`

Не вводить новые hex-фоны; только токены Tailwind из `colors.ts`.

---

## 3. Часть C: Typography & Brutalist Rules

### 3.1 Типографическая шкала

| Роль                      | Элемент          | Классы                                                                                                                                                                         | Где используется                                                                                             |
| ------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| H1                        | `<h1>`           | `text-[2.75rem] sm:text-6xl lg:text-8xl font-black tracking-tight uppercase leading-[0.95] sm:leading-none`                                                                    | **Только** `HeaderHero`                                                                                      |
| H2                        | `<h2>`           | `text-4xl sm:text-5xl font-black tracking-tight uppercase`                                                                                                                     | Все секции через `SectionHeader`                                                                             |
| Eyebrow                   | `<p>`            | `text-sm font-bold tracking-[0.24em] uppercase text-primary-950 dark:text-primary-300`                                                                                         | `SectionHeader`; в hero — расширенный вариант с `border-2 border-l-4 border-l-primary-500` (hero не трогаем) |
| Eyebrow (brutalist badge) | `<p>`            | `inline-block border-2 border-black border-l-4 border-l-primary-500 bg-background-primary px-3 py-1 … dark:border-white dark:border-l-primary-400 dark:bg-background-tertiary` | Contacts (через `eyebrow` slot)                                                                              |
| Description               | `<p>`            | `mt-4 max-w-2xl text-lg leading-8 font-medium text-text-secondary dark:text-neutral-400`                                                                                       | `SectionHeader`                                                                                              |
| Body                      | `<p>`            | `text-base leading-7 font-medium text-text-secondary dark:text-neutral-300`                                                                                                    | About body, карточки                                                                                         |
| Label                     | `<p>` / `<span>` | `text-xs font-bold tracking-[0.14em] uppercase text-text-secondary`                                                                                                            | Meta, счётчики, табы                                                                                         |

**Исправления в Phase 2:**

- `TimelineView` H2: `text-3xl md:text-4xl` → шкала H2.
- `SkillsMobileView` H2: привести к H2-шкале.
- Запрет новых `<h1>` вне hero.

### 3.2 Правила neobrutalist

| Правило       | Значение                                                                                                              | Примечание                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Скругления    | `rounded-none` везде, кроме декоративного blur-круга в hero                                                           | ProjectCard icon container: `rounded-xl` → `rounded-none`              |
| Границы       | `border-2 border-black dark:border-white` на карточках, кнопках, badge                                                | Contacts gradient section — без border на корне                        |
| Тени          | Hard offset: `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]` light; `dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]` dark | Hover: translate 2px + shadow 2px; active: translate 4px + shadow-none |
| Mint-акцент   | `primary-500` (`#00ffb9`), `border-l-primary-500`, `--accent-shadow` на кнопках                                       | Не вводить новые accent-цвета                                          |
| Фоны карточек | `bg-white dark:bg-black` или `dark:bg-neutral-900` только для ProjectCard (контраст паттерна)                         | Унифицировать через `Card` variant                                     |

### 3.3 Компонентные правки

#### 3.3.1 `ProjectCard` (`src/entities/project/ui/ProjectCard.tsx`)

- Pills (Код / Live): `rounded-full` → `rounded-none`.
- GitHub pill: добавить `border-2 border-black dark:border-white`, brutalist hover (translate + shadow), убрать `backdrop-blur-md`.
- Live pill: `border-2 border-black`, сохранить `backgroundColor: project.accentColor`.
- Icon container: `rounded-xl` → `rounded-none border-2 border-black dark:border-white`.

#### 3.3.2 `Button` (`src/shared/ui/Button/Button.tsx`)

Сейчас `primary` и `secondary` идентичны. Дифференциация:

| Variant     | Фон                      | Текст                        | Тень                                                                         |
| ----------- | ------------------------ | ---------------------------- | ---------------------------------------------------------------------------- |
| `primary`   | `bg-primary-500`         | `text-black`                 | `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]` / white в dark                      |
| `secondary` | `bg-white dark:bg-black` | `text-black dark:text-white` | `shadow-[4px_4px_0px_0px_var(--accent-shadow)]` (mint, как сейчас у primary) |
| `outline`   | без изменений            | без изменений                | без тени                                                                     |

Hover/active механика (translate + уменьшение тени) — общая для primary и secondary.

#### 3.3.3 `Card` (`src/shared/ui/Card/Card.tsx`)

Шкала padding (уже есть, зафиксировать как контракт):

| Token  | Класс | px  |
| ------ | ----- | --- |
| `none` | —     | 0   |
| `sm`   | `p-4` | 16  |
| `md`   | `p-6` | 24  |
| `lg`   | `p-8` | 32  |

Новые использования: error/not-found — `padding="lg"`.

#### 3.3.4 Страницы ошибок

**`app/not-found.tsx`:**

- Заменить `text-gray-*`, `border-gray-*` на `text-text-*`, `border-border-*`, `dark:` варианты из токенов.
- H1 «404» — оставить крупным, цвет `text-primary-600 dark:text-primary-400` (классы, не inline `style`).
- Убрать декоративные blur-градиенты **не** входит в скоуп (визуальный характер 404); только токенизация текста и border.

**`app/error.tsx`:**

- Убрать inline `style={{ backgroundColor, color }}` → Tailwind: `bg-background-primary`, `text-text-primary`, `text-text-secondary`.
- `<pre>` dev-блок: `bg-background-secondary border-2 border-black dark:border-white rounded-none`.

**`app/global-error.tsx`:**

- Сохранить инлайн-цвета в `criticalColors` (ограничение Next.js — нельзя импортировать модули). Привести hex к значениям из `colors.ts` в комментарии-ссылке; кнопка уже `rounded-none border-2`.

### 3.4 Визуальная иерархия

| Зона              | Контраст             | Детали                                                               |
| ----------------- | -------------------- | -------------------------------------------------------------------- |
| Hero              | Максимальный         | Крупный H1, mint-блок, интерактивы — **без изменений**               |
| Контентные секции | Спокойный            | H2 + description; muted body; тени только на интерактивных карточках |
| Contacts          | Высокий на градиенте | Белый H2, eyebrow-badge; не ослаблять                                |
| Footer            | Низкий               | Мельче body, без теней на тексте                                     |

**Запрет:** не добавлять новые кнопки, ссылки-CTA или интерактивные элементы в рамках полировки.

### 3.5 Аудит тёмной темы

Заменить ad-hoc вхождения:

| Файл                     | Было                              | Станет                                        |
| ------------------------ | --------------------------------- | --------------------------------------------- |
| `ProjectsView`           | `dark:bg-[#0a0a0a]`               | `dark:bg-background-tertiary`                 |
| `not-found.tsx`          | `text-gray-*`, `dark:text-gray-*` | `text-text-primary/secondary/muted`           |
| `ProjectCard`            | `dark:text-neutral-500` на muted  | `dark:text-neutral-400` для вторичного текста |
| Разрозненные `neutral-*` | где нет семантики                 | `text-text-secondary`, `text-text-muted`      |

Проверить все файлы из §1.3 grep-ом по `gray-`, `#[0-9a-f]{3,6}`, `style={{`.

---

## 4. Порядок реализации

### Фаза 1 — Layout foundation

1. Создать `Section` и `SectionHeader` с тестами Vitest.
2. Добавить экспорты в `src/shared/ui/index.ts`.
3. Мигрировать виджеты по таблице §2.5 (один PR или последовательные коммиты).
4. Исправить брейкпоинт Projects `sm` → `md`.
5. Визуальная проверка: 3 брейкпоинта × 2 темы × 6 секций (чеклист §5.2).

### Фаза 2 — Typography & brutalist polish

1. Обновить классы в `SectionHeader` по §3.1.
2. `ProjectCard` pills и icon container.
3. `Button` primary/secondary дифференциация.
4. `TimelineView`, `SkillsMobileView` — H2 шкала.
5. `not-found.tsx`, `app/error.tsx` — токены.
6. Dark mode audit (§3.5).
7. Финальный проход: grep ad-hoc цветов, ручной чеклист.

---

## 5. Тестирование

### 5.1 Vitest — `tests/shared/section.test.tsx`

```tsx
describe("Section", () => {
  it("renders section with id and default spacing py-24");
  it("applies compact spacing py-16");
  it("applies container-x and container-max on inner wrapper");
  it("renders as footer when as=footer");
});

describe("SectionHeader", () => {
  it("renders eyebrow, title, optional description");
  it("applies header-gap mb-12 lg:mb-16");
  it("centers content when align=center");
  it("renders ReactNode eyebrow for custom badges");
});
```

Использовать `@testing-library/react`, паттерн как в `tests/widgets/projects.test.tsx`.

### 5.2 Ручной чеклист

Для каждой комбинации **брейкпоинт × тема** проверить секции About, Projects, Skills, Experience, Contacts, Footer:

| #   | Проверка                                                               |
| --- | ---------------------------------------------------------------------- |
| 1   | Вертикальный padding соответствует `section-y` / `section-y-compact`   |
| 2   | Контент не шире `max-w-6xl`, горизонтальный padding `px-6` / `lg:px-8` |
| 3   | Заголовок секции отстоит от контента на `mb-12` / `lg:mb-16`           |
| 4   | Projects: deck на <768px, grid на ≥768px                               |
| 5   | Island nav появляется на ≥1024px                                       |
| 6   | Нет горизонтального скролла                                            |
| 7   | Dark mode: читаемый текст, границы видны, нет «сломанных» серых блоков |

**Брейкпоинты для проверки:** 375px (mobile), 768px (tablet), 1280px (desktop).  
**Темы:** light, dark (`.dark` на `<html>`).

### 5.3 Регрессия существующих тестов

После каждой фазы: `bun run test` — все существующие тесты должны проходить. При изменении разметки Projects обновить `tests/widgets/projects.test.tsx` только если ломаются селекторы.

---

## 6. Критерии приёмки

- [ ] Все виджеты из §2.5 используют `Section` (Footer — `as="footer"`).
- [ ] Единый `max-w-6xl` — нет `max-w-7xl`, `max-w-5xl` на уровне секций (внутренние band Timeline допускают `max-w-5xl` только для carousel content, не для section wrapper).
- [ ] Projects deck/grid переключается на `md` (768px).
- [ ] `SectionHeader` используется в About, Projects, Experience, Contacts; Skills — по решению §2.5.
- [ ] H2 единого размера во всех секциях (кроме hero H1).
- [ ] `primary` и `secondary` кнопки визуально различимы.
- [ ] ProjectCard pills — `rounded-none`, brutalist borders.
- [ ] Нет `gray-*` и произвольных hex в `not-found.tsx` и `error.tsx` (кроме `global-error` critical inline).
- [ ] Vitest для Section/SectionHeader — green.
- [ ] Ручной чеклист §5.2 пройден.

---

## 7. Риски и смягчение

| Риск                                                | Смягчение                                                                              |
| --------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Contacts сломает canvas hit-area при смене padding  | Сохранить `relative z-10` на inner; не менять pointer handlers                         |
| Timeline carousel сужается                          | `innerClassName` для band; не уменьшать `max-w-5xl` внутри grid                        |
| Skills desktop без заголовка — визуальный дисбаланс | Принято: marquee самодостаточен; mobile получает `SectionHeader` в Phase 2             |
| Button primary меняет hero CTA                      | Hero использует `shadowColor` override — проверить контраст после смены variant styles |

---

## 8. Ссылки на текущее состояние (baseline)

Ключевые расхождения с контрактом на момент спецификации:

- `AboutView`: `py-20` → `py-24`; grid `gap-10` → `gap-12 lg:gap-16`
- `ProjectsView`: `max-w-7xl`, `py-20`, deck на `sm`
- `SkillsDesktopView`: `py-10`, нет `container-x`
- `TimelineView`: `py-10 lg:py-12`, H2 меньше шкалы, собственный `px-4`
- `ContactsView`: `py-20`, `px-4`, `container` class
- `FooterWidget`: `py-12` → `py-16`
- `Button`: primary === secondary
- `ProjectCard`: `rounded-full` pills, `rounded-xl` icon

Документ является единственным источником правды для реализации полировки.
