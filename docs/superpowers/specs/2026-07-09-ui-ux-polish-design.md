# UI/UX Polish — Design Spec

**Date:** 2026-07-09  
**Status:** Approved in brainstorming; awaiting written-spec review  
**Project:** Kotikov Portfolio

---

## Summary

Полировка развивает существующий Bauhaus/neobrutalism-язык сайта и не превращает его в спокойное шаблонное портфолио. Выбранное направление — **«Управляемое шоу»**: paint, Nyancat, marquee, deck и timeline остаются фирменными элементами, но работают по сценарию внимания.

Путь пользователя:

1. За 5–10 секунд понять, кто такой Арсений и чем он занимается.
2. Увидеть проекты как главное доказательство уровня.
3. Связать навыки с профессиональным опытом.
4. Без поиска перейти к Email или Telegram.

Каждый viewport получает один доминирующий эффект. Контент читается до запуска интерактива, а непрерывная анимация останавливается вне активной сцены.

## Confirmed decisions

- Основная аудитория: русскоязычные рекрутеры и нанимающие менеджеры.
- Главное действие: связаться с Арсением.
- Характер: сохранить максимум игры и вау-эффектов.
- Направление: «Управляемое шоу», а не аркада и не редакционный минимализм.
- Scope: структура, тексты, визуал, адаптивность, доступность и производительность.
- Язык текущей версии: полностью русский UI.
- Приоритет устройств: равное качество mobile и desktop.
- Визуальная основа: текущие mint, ink, paper, Geist Sans/Mono и жёсткая геометрия.

## Goals

- Сделать профиль понятным рекрутеру до первого взаимодействия.
- Увеличить заметность и доступность контакта без навязчивого sticky-баннера.
- Сохранить фирменные интерактивы и сделать их визуально управляемыми.
- Устранить языковую смесь, спорные ARIA-паттерны и keyboard-ловушки.
- Обеспечить стабильный первый рендер без desktop-to-mobile мигания.
- Удержать Core Web Vitals в зелёной зоне в Lighthouse mobile-профиле с 4× CPU throttling и simulated Slow 4G.
- Сделать light, dark и reduced-motion самостоятельными полноценными композициями.
- Оставлять сайт понятным при отключённом Canvas, motion или клиентском JavaScript.

## Non-goals

- Полная смена бренда, палитры или Bauhaus/neobrutalism-стиля.
- EN-версия и переключатель локали.
- Новые страницы кейсов или новая CMS.
- Добавление резюме, формы обратной связи, аналитической панели или новых социальных сетей.
- Удаление Nyancat, paint, deck, marquee или timeline только ради упрощения.
- Подключение Framer Motion, GSAP или другого тяжёлого animation runtime без измеренной необходимости.
- Переписывание FSD-архитектуры или нерелевантный рефакторинг.

---

## Existing experience

Главная уже построена как последовательность `Header → About → Projects → Skills → Experience → Contacts → Footer`. Сайт имеет сильный визуальный язык, адаптивные варианты сложных секций, основу для reduced motion и хорошие focus/dialog-паттерны в проектах.

Полировке мешают:

- несколько конкурирующих эффектов в hero и contacts;
- английские labels внутри русской версии;
- `useIsMobile` с desktop-состоянием на первом mobile-render;
- потенциальный horizontal overflow при расширении project grid;
- фиксированная высота mobile deck;
- постоянные canvas/rAF-циклы без общей политики активности;
- спорная семантика `tablist` в carousel/chips;
- движущиеся Nyancat-targets в keyboard tab order;
- неодинаковые подсказки для внешних ссылок;
- emoji на error-экранах;
- отсутствие E2E и visual-regression проверки.

---

## Experience architecture

### Scene 1 — Hero: зацепить

Hero сначала показывает:

- «Арсений Котиков · Frontend-разработчик»;
- имя/бренд `Kotikov`;
- короткое обещание о React, Next.js, TypeScript и внимании к деталям;
- primary CTA «Связаться»;
- secondary CTA «Смотреть проекты».

Paint и Nyancat занимают отдельную интерактивную зону и не перекрывают copy или CTA. До первого пользовательского действия hero остаётся выразительным, но читаемым.

Navigation сохраняет morph-поведение. На desktop внутри острова постоянно доступна выделенная команда «Написать». На mobile тот же CTA виден в меню и не зависит от конца страницы.

### Scene 2 — About and proof strip: дать контекст

Текущий About сохраняется, но становится компактнее и ближе к hero. Его задача — ответить на вопросы «где», «какой опыт» и «какой инженерный подход», не задерживая переход к проектам.

Ключевые proof points:

- Беларусь;
- БГУИР;
- опыт в Innowise;
- Product UI;
- React / Next.js;
- accessibility и performance как часть инженерного подхода.

Текст и code-aesthetic spec показывают одну информацию, поэтому screen-reader fallback остаётся полным и не дублирует её дважды.

### Scene 3 — Projects: доказать уровень

Projects остаются главным доказательством. До раскрытия карточка должна позволять быстро считать:

- название и тип продукта;
- роль Арсения;
- задачу или контекст;
- измеримый или конкретный результат;
- основной стек.

Mobile deck и desktop expandable grid используют один источник контента. Раскрытие продолжает показывать «задача → решение → результат + стек». Layout не выходит за viewport и не опирается на фиксированную высоту текста.

CTA «Код», «Live» и «Подробнее» имеют явную визуальную и семантическую иерархию. Внешние ссылки сообщают, что откроются в новой вкладке.

### Scene 4 — Skills and Experience: углубить доверие

Skills группируются по рабочим компетенциям, а не воспринимаются как бесконечная лента логотипов. Marquee остаётся доминирующим эффектом skills-сцены, но:

- запускается только во viewport;
- приостанавливается при скрытой вкладке;
- не конкурирует с непрерывной анимацией cursor Nyancat;
- имеет статичную reduced-motion композицию;
- дублируется семантическим списком навыков только один раз для assistive technology.

Timeline сохраняет mobile chips/carousel и desktop rail. Карточки сильнее выделяют ответственность, вклад и рост. Управление получает корректную семантику: native list/region либо полноценный roving-tab pattern, но не focusable `tablist`-контейнер с отдельными tabs.

### Scene 5 — Contacts: конвертировать

Contacts остаётся ярким игровым финалом. Email и Telegram визуально сильнее GitHub и декоративного слоя, потому что ведут к главному действию.

Canvas и paw interaction не блокируют вертикальный scroll на touch-устройствах. «Очистить холст» и контактные карточки имеют touch target не меньше 44×44 CSS px и видимый keyboard focus.

Footer повторяет навигацию и social links, но не конкурирует с основным contact CTA.

---

## Visual system

### Color

Сохраняются четыре базовые роли:

- `accent`: mint `#00ffb9`;
- `ink`: near-black `#111111`;
- `paper`: `#f5f5f3`;
- `muted`: нейтральный серый для вторичного фона и границ.

Mint используется как фон, маркер и крупный акцент. Он не используется для мелкого текста на белом. Обычный текст соответствует контрасту не ниже 4.5:1 в light и dark.

Семантические success/warning/error цвета не маскируются mint-оттенками. Если они понадобятся служебным экранам, для них создаются отдельные токены с текстовым или иконографическим подкреплением.

### Typography

- Geist Sans остаётся основным шрифтом.
- Geist Mono применяется для eyebrow, labels, metrics и управляющих подсказок.
- Display и section headings получают согласованные `clamp()`-размеры.
- Body text не меньше 1rem на mobile, с unitless line-height 1.5–1.7.
- Длина основных текстовых блоков ограничивается диапазоном 65–75 символов.
- Заголовки используют `text-wrap: balance`, только если это не создаёт визуальные пустоты внутри жёсткой карточки.

### Geometry and depth

- Основная граница: 2 px.
- Малый hard shadow: 3–4 px для управляющих элементов.
- Большой hard shadow: 6–8 px для активной или раскрытой карточки.
- Фоновый контент не получает тень.
- Hover/pressed state меняет цвет, opacity, shadow offset или transform, но не размеры элемента.
- Общий z-index scale фиксируется для content, nav, overlay и dialog.
- App chrome использует один набор SVG-иконок; brand icons остаются официальными и узнаваемыми.

### Section rhythm

`Section` и `SectionHeader` остаются общими примитивами. Полировка унифицирует:

- max width;
- vertical spacing;
- расстояние между eyebrow, heading и description;
- положение фонового pattern;
- начало и конец интерактивной сцены.

---

## Motion architecture

### Motion policy

Существующий performance feature расширяется общей политикой активности. Тяжёлые сцены получают единый контракт:

- находится ли сцена во viewport;
- активна ли вкладка;
- включён ли `prefers-reduced-motion`;
- разрешена ли непрерывная анимация;
- доступен ли pointer, touch или keyboard;
- какой эффект в сцене является доминирующим.

`IntersectionObserver` и `visibilitychange` управляют жизненным циклом. Непрерывный `requestAnimationFrame` не работает offscreen.

Предпочтительная граница — scene-level hook в `features/performance`, а не новый глобальный state manager. Глобальный coordinator добавляется только если измерения покажут одновременно активные циклы между соседними секциями.

### Motion levels

1. **Micro interaction:** 150–220 ms, hover/focus/press, `transform` и `opacity`.
2. **Component transition:** 220–300 ms, menu, card detail, chips и CTA feedback.
3. **Signature interaction:** scroll-, pointer- или gesture-driven paint, deck, marquee и Nyancat.
4. **Reduced motion:** статичная композиция и мгновенные state changes без глобального `animation-duration: 0.01ms`.

Continuous decorative animation не является обязательной для понимания контента.

---

## Responsive design

- Проверяемые viewport: 375, 768, 1024 и 1440 px.
- Mobile и desktop показывают одинаковый объём смысловой информации.
- Responsive alternatives выбираются CSS/container queries там, где это возможно.
- Если mobile и desktop требуют разных interaction wrappers, оба используют один content source и стабильную серверную разметку.
- Скрытый responsive-вариант имеет `display: none` и не запускает эффекты.
- `useIsMobile` не подменяет уже показанный desktop UI после hydration.
- Project deck не использует фиксированную высоту, зависящую от предположения о длине текста.
- Expandable project grid не расширяет document width.
- Timeline rail и отрицательные margins проверяются на отсутствие page-level horizontal overflow.
- Swipe areas используют `touch-action` только по нужной оси; drawing canvas может использовать `touch-action: none` лишь внутри явной drawing zone.

---

## Accessibility

- Весь UI chrome, ARIA labels и инструкции — на русском.
- В начале страницы доступны два skip-link: «К основному содержимому» и «К проектам».
- Все interactive targets имеют видимый `:focus-visible` outline с offset.
- Минимальный фактический touch target — 44×44 CSS px.
- Focus order соответствует визуальному порядку.
- Nyancat не становится движущейся keyboard-мишенью. Keyboard-пользователь получает стабильную команду «Запустить Нянкота» или декоративный Nyancat исключается из tab order.
- Dialog/sheet сохраняет focus trap, Escape, focus restore и `aria-labelledby`.
- Carousel и timeline используют корректную composite-widget семантику.
- Внешние ссылки получают доступную подсказку «откроется в новой вкладке».
- Цвет не является единственным индикатором состояния.
- Canvas имеет текстовую альтернативу; контакты не зависят от canvas.
- Forced Colors Mode сохраняет границы, focus и различимость действий.

---

## Performance and resilience

Перед изменениями фиксируется baseline для production build. Целевые бюджеты проверяются в Lighthouse mobile-профиле с 4× CPU throttling и simulated Slow 4G:

- LCP ≤ 2.5 s;
- INP ≤ 200 ms;
- CLS ≤ 0.1;
- signature motion стремится к 60 fps и не опускается устойчиво ниже 30 fps.

Меры:

- останавливать rAF, observers и canvas updates вне активной сцены;
- не держать `will-change` постоянно;
- использовать `content-visibility: auto` только вместе с реалистичным `contain-intrinsic-size`;
- резервировать размеры изображений и async-контента;
- lazy-load ниже-fold media;
- измерять bundle growth;
- не ухудшать серверный рендер ради декоративной интерактивности.

404, route error и global error получают:

- русский copy;
- Bauhaus geometry и те же tokens;
- SVG/geometric icon вместо emoji;
- понятный primary action назад;
- минимальный client runtime;
- корректное поведение без motion.

---

## Testing strategy

### Unit

- motion/performance policy;
- deck and timeline calculations;
- content contracts;
- responsive helpers;
- external-link metadata.

Цель — не ниже 80% unit coverage, критические interaction paths покрываются полностью.

### Component integration

Testing Library проверяет:

- primary/secondary CTA order;
- keyboard navigation;
- focus trap and restore;
- Russian accessible names;
- dialog and carousel semantics;
- theme and reduced-motion variants;
- effects do not start when inactive.

Внутренняя логика не мокается. Мокаются только browser APIs и внешние границы.

### End-to-end

Добавляется Playwright browser suite для:

- recruiter path `Hero → Projects → Contacts`;
- desktop navigation morph;
- mobile menu;
- project deck/grid detail;
- timeline keyboard and swipe;
- theme persistence;
- reduced motion;
- 404 and error recovery.

### Visual regression

Снимки фиксируются для 375, 768, 1024 и 1440 px:

- light and dark;
- hero;
- expanded project;
- skills;
- timeline;
- contacts;
- mobile menu;
- 404/error;
- reduced-motion state.

### Runtime verification

- Lighthouse/DevTools production measurements before and after.
- CPU trace for skills marquee, cursor Nyancat and both canvas scenes.
- Проверка остановки эффектов offscreen и при hidden tab.
- Keyboard-only and screen-reader smoke pass.
- Touch smoke pass без конфликтов со scroll.

---

## Delivery waves

### Wave 1 — Meaning and accessibility

- Hero/nav contact hierarchy.
- Russian labels and external-link hints.
- SSR/mobile stability and overflow fixes.
- Carousel, focus and skip-navigation semantics.
- Baseline CWV, keyboard and contrast audit.

После волны сайт остаётся полностью пригодным к публикации.

### Wave 2 — Visual and motion polish

- Unified tokens, typography, borders, shadows and spacing.
- Hero, project cards and section rhythm.
- Scene motion policy for canvas, marquee and Nyancat.
- Light/dark/reduced-motion parity.
- Contacts as the final conversion scene.

### Wave 3 — Resilience and regression control

- Bauhaus 404/error.
- Offscreen and hidden-tab pauses.
- E2E and visual regression.
- Final CWV and runtime-motion measurements.
- Cross-viewport acceptance pass.

---

## Acceptance criteria

- Имя, роль и специализация понятны без interaction за 5–10 секунд.
- Primary «Связаться» виден в hero и navigation.
- Projects легко сканируются до раскрытия.
- Ни один decorative effect не перекрывает CTA или essential content.
- Нет английских labels в русской версии.
- Нет горизонтального page overflow на целевых viewport.
- Нет desktop-to-mobile content flash.
- Keyboard path не содержит движущихся targets или dead ends.
- Light, dark and reduced-motion выглядят намеренно спроектированными.
- Offscreen and hidden-tab continuous effects останавливаются.
- Контактные ссылки работают без canvas и client state.
- Production CWV соответствует установленным бюджетам либо отклонение задокументировано измерением и согласовано.
- Unit, component, E2E and visual checks проходят.

---

## Risks and mitigations

### Слишком много эффектов остаётся одновременно

Вводится scene-level lifecycle; Nyancat и paint не получают два независимых непрерывных цикла в одном viewport.

### Оптимизация уберёт фирменный характер

Сначала измеряется baseline и исправляется lifecycle. Визуальные детали упрощаются только после подтверждённого bottleneck.

### Responsive alternatives дублируют DOM

Обе версии используют один data source. Скрытый вариант не участвует в layout, accessibility tree или animation lifecycle. Для крупных секций предпочтителен shared semantic core.

### Полировка разрастётся в полный редизайн

Mint, Geist, square geometry, section order и существующие signature interactions зафиксированы как инварианты.

### Visual changes ухудшат контраст

Каждая wave проверяется в light, dark и Forced Colors; mint не используется как мелкий текст на светлом фоне.

### E2E/visual suite увеличит поддержку

Покрываются только critical recruiter path и стабильные ключевые состояния, без snapshot каждого декоративного кадра.

---

## References

- `app/page.tsx`
- `app/layout.tsx`
- `app/error.tsx`
- `app/global-error.tsx`
- `app/not-found.tsx`
- `src/widgets/header/`
- `src/widgets/about/`
- `src/widgets/projects/`
- `src/widgets/skills/`
- `src/widgets/timeline/`
- `src/widgets/contacts/`
- `src/features/performance/`
- `src/features/nyancat/`
- `src/features/paw/`
- `src/shared/styles/tailwind/`
- `docs/superpowers/specs/2026-07-03-project-card-expansion-design.md`
