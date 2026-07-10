# InfoSec Content Pivot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework ktkv.me content so the site reads as an InfoSec profile (SOC + AppSec) with CodeAnalyzer-first projects, without redesigning UI.

**Architecture:** Single source of truth stays in `src/shared/config/content/*`. Update copy, project list, skills categories, and timeline entries; flip timeline sort to newest-first so the carousel opens on hoster.by; align SEO strings in `app/layout.tsx` and `app/manifest.ts`. Widgets keep their shells.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, React Testing Library, Bun, existing `react-icons` + content config modules.

**Spec:** `docs/superpowers/specs/2026-07-10-infosec-content-pivot-design.md`

---

## File map

| File | Responsibility |
| --- | --- |
| `tests/shared/content.test.ts` | Contract tests for content shape and IB identity |
| `tests/widgets/projects.test.tsx` | Asserts featured project titles in UI |
| `src/shared/config/content/header.ts` | Hero eyebrow / subtitle |
| `src/shared/config/content/about.ts` | About body, spec fields, principles |
| `src/shared/config/content/person.ts` | Structured-data identity |
| `src/shared/config/content/footer.ts` | Footer blurb |
| `src/shared/config/content/timeline.ts` | Work + education entries |
| `src/shared/config/content/skill.ts` | Marquee skills + grouped tags |
| `src/entities/skill/model/types.ts` | Skill `category` union |
| `src/shared/config/content/projects.ts` | Three showcase cards |
| `src/widgets/timeline/ui/TimelineView.tsx` | Sort newest-first |
| `app/layout.tsx` | Document title, description, keywords, OG alt |
| `app/manifest.ts` | PWA manifest name |

Do **not** change navigation hrefs, widget layouts, motion, or README in this plan.

---

### Task 1: Lock content contracts in tests (TDD)

**Files:**
- Modify: `tests/shared/content.test.ts`
- Modify: `tests/widgets/projects.test.tsx`

- [ ] **Step 1: Update `content.test.ts` expectations for the IB pivot**

Replace the skills-groups, timeline, and add identity assertions. Keep CTA and navigation tests as-is. Full file:

```ts
import { describe, expect, it } from "vitest";

import {
  aboutContent,
  contactsData,
  footerInfo,
  headerContent,
  navigation,
  personData,
  projectsData,
  skillGroups,
  skillsData,
  timelineData,
} from "@/shared/config/content";

describe("content model", () => {
  it("exposes the polished navigation anchors", () => {
    expect(navigation.map((n) => n.href)).toEqual([
      "#header",
      "#about",
      "#projects",
      "#skills",
      "#experience",
      "#contacts",
    ]);
  });

  it("has no placeholder nav labels", () => {
    expect(navigation.some((n) => n.name === "Туда")).toBe(false);
  });

  it("prioritizes contact as the primary recruiter action", () => {
    expect(headerContent.buttons.primary).toEqual({
      text: "Связаться",
      href: "#contacts",
    });
    expect(headerContent.buttons.secondary).toEqual({
      text: "Смотреть проекты",
      href: "#projects",
    });
  });

  it("positions the hero as SOC, not frontend", () => {
    expect(headerContent.eyebrow).toBe("Арсений Котиков · SOC");
    expect(headerContent.title).toBe("Kotikov");
    expect(headerContent.subtitle.toLowerCase()).not.toContain("frontend");
    expect(headerContent.subtitle.length).toBeGreaterThan(40);
  });

  it("surfaces three featured projects with CodeAnalyzer first", () => {
    expect(projectsData).toHaveLength(3);
    expect(projectsData.map((p) => p.slug)).toEqual([
      "code-analyzer",
      "bsuir-iis-api",
      "web-messenger",
    ]);
    for (const p of projectsData) {
      expect(p.title).toBeTruthy();
      expect(p.repoUrl).toMatch(/^https:\/\/github\.com\//);
      expect(p.stack.length).toBeGreaterThan(0);
    }
  });

  it("includes project details for storytelling expand panels", () => {
    for (const project of projectsData) {
      expect(project.details.challenge.length).toBeGreaterThan(10);
      expect(project.details.solution.length).toBeGreaterThan(10);
      expect(project.details.outcome.length).toBeGreaterThan(10);
    }
  });

  it("drops percentage levels from skills and groups them for IB", () => {
    expect(skillsData.every((s) => !("level" in s))).toBe(true);
    expect(skillGroups.map((g) => g.title)).toEqual([
      "Security & DFIR",
      "Offensive / практика",
      "Development",
    ]);
    expect(
      skillsData.every((s) =>
        s.category === "security" || s.category === "offensive" || s.category === "development"
      )
    ).toBe(true);
  });

  it("defines an about block with three typed principles", () => {
    expect(aboutContent.principles).toHaveLength(3);
    for (const principle of aboutContent.principles) {
      expect(principle.type).toMatch(/^(feat|a11y|perf)$/);
      expect(principle.text.length).toBeGreaterThan(0);
    }
    expect(aboutContent.principles.map((p) => p.type)).toEqual(["feat", "a11y", "perf"]);
    expect(aboutContent.spec.fields.find((f) => f.key === "role")?.value).not.toBe("frontend");
  });

  it("keeps person SEO on SOC / AppSec", () => {
    expect(personData.jobTitle).toBe("SOC / AppSec");
    expect(personData.description.toLowerCase()).not.toMatch(/frontend разработчик/);
    expect(footerInfo.description.toLowerCase()).not.toContain("frontend-разработчик");
  });

  it("orders contacts Email then Telegram then GitHub", () => {
    expect(contactsData.map(({ label }) => label)).toEqual(["Email", "Telegram", "GitHub"]);
  });
});

describe("timeline data", () => {
  it("contains exactly three non-project entries without hackathons", () => {
    expect(timelineData).toHaveLength(3);
    expect(timelineData.every((e) => e.type !== "project")).toBe(true);
    expect(timelineData.every((e) => e.type !== "hackathon")).toBe(true);
    expect(timelineData.map((e) => e.company)).toEqual(["hoster.by", "Innowise", "БГУИР"]);
  });

  it("uses unified period strings", () => {
    expect(timelineData.map((e) => e.period)).toEqual([
      "2026 — н.в.",
      "июн 2025 — ноя 2025",
      "2024 — н.в.",
    ]);
  });

  it("has required fields on every entry", () => {
    for (const entry of timelineData) {
      expect(entry.title).toBeTruthy();
      expect(entry.company).toBeTruthy();
      expect(entry.description).toBeTruthy();
      expect(entry.technologies.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("keeps SOC copy careful (no incident narrative keywords)", () => {
    const soc = timelineData.find((e) => e.company === "hoster.by");
    expect(soc).toBeDefined();
    const text = `${soc!.title} ${soc!.description}`.toLowerCase();
    expect(text).not.toMatch(/ransomware|anydesk|ioc|payload/);
  });
});
```

- [ ] **Step 2: Update `projects.test.tsx` to expect CodeAnalyzer**

```tsx
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectsWidget } from "@/widgets/projects";

describe("ProjectsWidget", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  it("renders the heading and action buttons per project", () => {
    render(<ProjectsWidget />);
    expect(screen.getByRole("heading", { name: /избранные/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /код/i })).toHaveLength(4);
    expect(screen.getAllByRole("button", { name: /подробнее/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("CodeAnalyzer")).toHaveLength(2);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `bun run test -- tests/shared/content.test.ts tests/widgets/projects.test.tsx`

Expected: FAIL on hero eyebrow, skill groups, timeline length/companies, File Manager / CodeAnalyzer assertions.

- [ ] **Step 4: Commit the failing contract tests**

```bash
git add tests/shared/content.test.ts tests/widgets/projects.test.tsx
git commit -m "test: lock InfoSec content pivot contracts"
```

---

### Task 2: Hero, about, person, footer

**Files:**
- Modify: `src/shared/config/content/header.ts`
- Modify: `src/shared/config/content/about.ts`
- Modify: `src/shared/config/content/person.ts`
- Modify: `src/shared/config/content/footer.ts`

- [ ] **Step 1: Replace `header.ts`**

```ts
export const headerContent = {
  eyebrow: "Арсений Котиков · SOC",
  title: "Kotikov",
  subtitle:
    "ИБ-практик: DFIR и мониторинг в SOC, уязвимости приложений и безопасная разработка. Проекты и опыт — ниже.",
  buttons: {
    primary: {
      text: "Связаться",
      href: "#contacts",
    },
    secondary: {
      text: "Смотреть проекты",
      href: "#projects",
    },
  },
} as const;
```

- [ ] **Step 2: Replace `about.ts`**

```ts
export const aboutContent = {
  title: "Коротко обо мне",
  body: "Меня зовут Арсений Котиков (Kotikov). Студент информационной безопасности в БГУИР, Intern SOC в hoster.by. Параллельно углубляюсь в AppSec: SAST, разбор уязвимостей и secure code review. Фронтенд-опыт помогает видеть, как дыры появляются в реальном коде.",
  spec: {
    fileName: "about.ts",
    exportName: "kotikov",
    fields: [
      { key: "name", value: "Арсений Котиков" },
      { key: "handle", value: "Kotikov" },
      { key: "role", value: "SOC / AppSec" },
      { key: "location", value: "Беларусь" },
      { key: "education", value: "БГУИР · ИБ" },
      { key: "experience", value: "hoster.by" },
    ],
  },
  principles: [
    { type: "feat", text: "Ясный сигнал роли важнее общего портфолио-шума" },
    { type: "a11y", text: "Публично — возможности и стек, без чужих инцидентов" },
    { type: "perf", text: "Инструменты и проверки должны выдерживать реальный код" },
  ],
} as const;
```

- [ ] **Step 3: Replace `person.ts`**

```ts
import { social } from "./social";

export const personData = {
  name: "Arsenij Kotikov",
  nameRu: "Арсений Котиков",
  nickname: "Kotikov",
  jobTitle: "SOC / AppSec",
  description:
    "Арсений Котиков (Kotikov) — студент информационной безопасности, Intern SOC и практик AppSec: DFIR, SAST и разбор уязвимостей приложений",
  url: "https://ktkv.me",
  sameAs: [social.github.url, social.telegram.url, social.linkedin.url],
  email: social.email.address,
  skills: [
    "SOC",
    "AppSec",
    "Incident Response",
    "Digital Forensics",
    "SAST",
    "OWASP Top 10",
    "Python",
    "TypeScript",
    "React",
    "FastAPI",
  ],
} as const;
```

- [ ] **Step 4: Replace `footer.ts`**

```ts
export const footerInfo = {
  title: "Kotikov",
  description:
    "SOC и AppSec: разбор инцидентов, безопасная разработка и инструменты для поиска уязвимостей в коде.",
} as const;
```

- [ ] **Step 5: Run focused tests**

Run: `bun run test -- tests/shared/content.test.ts`

Expected: Still FAIL on projects, skills, timeline (not yet updated). Hero / person / footer / about role assertions should PASS.

- [ ] **Step 6: Commit**

```bash
git add src/shared/config/content/header.ts src/shared/config/content/about.ts src/shared/config/content/person.ts src/shared/config/content/footer.ts
git commit -m "feat: pivot hero, about, SEO person, and footer to SOC/AppSec"
```

---

### Task 3: Timeline data + newest-first sort

**Files:**
- Modify: `src/shared/config/content/timeline.ts`
- Modify: `src/widgets/timeline/ui/TimelineView.tsx` (sort comparator only)

- [ ] **Step 1: Replace `timeline.ts`**

Array order matches the locked narrative (hoster → Innowise → БГУИР). Widget will also sort by period newest-first.

```ts
export const timelineData = [
  {
    id: 1,
    title: "SOC Analyst Intern",
    company: "hoster.by",
    period: "2026 — н.в.",
    description:
      "Практика в SOC: triage и DFIR на Windows/Linux, разбор логов и сетевого трафика, ведение кейсов. Стек на уровне категорий — timeline analysis, network forensics, IR-платформа. Без публичных деталей клиентских инцидентов.",
    technologies: ["DFIR", "IR", "MITRE ATT&CK", "Wireshark"],
    type: "work" as const,
  },
  {
    id: 2,
    title: "Frontend Developer Intern",
    company: "Innowise",
    period: "июн 2025 — ноя 2025",
    description:
      "Инженерный бэкграунд: React/TypeScript-приложения, качество кода и командная поставка. Опыт чтения и сборки UI помогает в AppSec и code review.",
    technologies: ["React", "TypeScript", "GraphQL"],
    type: "work" as const,
  },
  {
    id: 3,
    title: "Информационная безопасность",
    company: "БГУИР",
    period: "2024 — н.в.",
    description: "Бакалавриат по информационной безопасности (3 курс, выпуск 2028).",
    technologies: ["InfoSec", "Cryptography"],
    type: "education" as const,
  },
];
```

- [ ] **Step 2: Flip sort in `TimelineView.tsx` to newest-first**

In the `useMemo` sort callback, change:

```ts
const byPeriod = parsePeriodStart(a.period) - parsePeriodStart(b.period);
```

to:

```ts
const byPeriod = parsePeriodStart(b.period) - parsePeriodStart(a.period);
```

Keep the `a.id - b.id` tie-break as-is (or use `b.id - a.id` if you prefer; with distinct periods it rarely matters).

- [ ] **Step 3: Run timeline-related tests**

Run: `bun run test -- tests/shared/content.test.ts tests/widgets/TimelineView.test.tsx tests/widgets/TimelineEditorialRail.test.tsx`

Expected: content timeline assertions PASS. TimelineView tests should still PASS (they use `timelineData.length`, not hardcoded titles).

- [ ] **Step 4: Commit**

```bash
git add src/shared/config/content/timeline.ts src/widgets/timeline/ui/TimelineView.tsx
git commit -m "feat: replace timeline with SOC-first IB experience"
```

---

### Task 4: Skills categories and data

**Files:**
- Modify: `src/entities/skill/model/types.ts`
- Modify: `src/shared/config/content/skill.ts`

- [ ] **Step 1: Update the category union**

```ts
export interface SkillData {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "security" | "offensive" | "development";
}
```

- [ ] **Step 2: Replace `skill.ts`**

```ts
import { FaBug, FaGitAlt, FaPython, FaReact, FaShieldAlt } from "react-icons/fa";
import { SiBurpsuite, SiFastapi, SiTypescript, SiWireshark } from "react-icons/si";

import { colors } from "@/styles/colors";

export const skillsData = [
  {
    id: 1,
    name: "OWASP / SAST",
    description: "Классы уязвимостей и статический анализ",
    icon: FaShieldAlt,
    color: colors.accent[600],
    category: "security" as const,
  },
  {
    id: 2,
    name: "DFIR",
    description: "Triage, логи, timeline analysis",
    icon: SiWireshark,
    color: colors.accent[700],
    category: "security" as const,
  },
  {
    id: 3,
    name: "MITRE ATT&CK",
    description: "Карта техник для разбора атак",
    icon: FaBug,
    color: colors.accent[800],
    category: "security" as const,
  },
  {
    id: 4,
    name: "Burp Suite",
    description: "Web exploitation и проверка контролей",
    icon: SiBurpsuite,
    color: colors.accent[500],
    category: "offensive" as const,
  },
  {
    id: 5,
    name: "Python",
    description: "Автоматизация и AppSec-инструменты",
    icon: FaPython,
    color: colors.semantic.success.DEFAULT,
    category: "development" as const,
  },
  {
    id: 6,
    name: "TypeScript",
    description: "Типобезопасный код и SDK",
    icon: SiTypescript,
    color: colors.accent[700],
    category: "development" as const,
  },
  {
    id: 7,
    name: "FastAPI",
    description: "API для security-tooling",
    icon: SiFastapi,
    color: colors.accent[600],
    category: "development" as const,
  },
  {
    id: 8,
    name: "React",
    description: "UI-бэкграунд для secure review",
    icon: FaReact,
    color: colors.accent[600],
    category: "development" as const,
  },
  {
    id: 9,
    name: "Git",
    description: "Контроль версий и ревью",
    icon: FaGitAlt,
    color: colors.accent[600],
    category: "development" as const,
  },
];

export const skillGroups = [
  {
    title: "Security & DFIR",
    items: ["OWASP Top 10", "SAST", "Incident Response", "DFIR", "MITRE ATT&CK", "Wireshark"],
  },
  {
    title: "Offensive / практика",
    items: ["Burp Suite", "Web exploitation", "JWT / SSRF", "HackTheBox"],
  },
  {
    title: "Development",
    items: ["Python", "FastAPI", "TypeScript", "React", "Docker", "Git"],
  },
] as const;
```

If `SiBurpsuite`, `SiWireshark`, or `SiFastapi` fail TypeScript resolve, swap to icons that already compile in the repo (`FaBug`, `FaShieldAlt`, `FaServer`, `SiTypescript`) — keep the **names/descriptions** above.

- [ ] **Step 3: Run skills-related tests**

Run: `bun run test -- tests/shared/content.test.ts tests/widgets/SkillsWidget.test.tsx tests/widgets/SkillsCoverage.test.tsx`

Expected: content skills assertions PASS. Widget tests PASS if they do not hardcode old group titles.

- [ ] **Step 4: Commit**

```bash
git add src/entities/skill/model/types.ts src/shared/config/content/skill.ts
git commit -m "feat: regroup skills for Security, Offensive, and Development"
```

---

### Task 5: Projects showcase

**Files:**
- Modify: `src/shared/config/content/projects.ts`

- [ ] **Step 1: Replace `projects.ts` with the three locked cards**

Omit `imageSrc` for CodeAnalyzer and BSUIR IIS API (no assets under `public/projects/`). Keep Web Messenger screenshot.

```ts
import type { IconType } from "react-icons";
import { FaPython, FaReact } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";

export type ProjectCardPattern = "waves" | "dots" | "chevrons" | "stripes" | "scatter";

export interface ProjectDetail {
  challenge: string;
  solution: string;
  outcome: string;
}

export interface ProjectContent {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  stack: string[];
  role: string;
  imageSrc?: string;
  imageAlt: string;
  repoUrl: string;
  liveUrl?: string;
  cardPeriod: string;
  cardMeta: string;
  cardPattern: ProjectCardPattern;
  accentColor: string;
  cardIcon: IconType;
  details: ProjectDetail;
}

export const projectsData: ProjectContent[] = [
  {
    slug: "code-analyzer",
    title: "CodeAnalyzer",
    eyebrow: "AppSec · SAST",
    summary:
      "Статический анализатор для JS/TS: 13 правил по классам OWASP Top 10, taint analysis, вывод SARIF 2.1.0, сравнение с Semgrep на реальных корпусах. Полностью в Docker.",
    stack: ["Python", "FastAPI", "tree-sitter", "Celery", "Redis", "PostgreSQL", "Docker"],
    role: "AppSec Tooling",
    imageAlt: "CodeAnalyzer — SAST для JS/TS",
    repoUrl: "https://github.com/kotru21/CodeAnalyzerPython",
    cardPeriod: "2025–26",
    cardMeta: "SAST · Open Source",
    cardPattern: "chevrons",
    accentColor: "#2cffc7",
    cardIcon: FaPython,
    details: {
      challenge: "Находить injection-классы в JS/TS без ручного просмотра всего репозитория",
      solution: "Taint analysis на tree-sitter, правила под OWASP/CWE, SARIF для CI",
      outcome: "13 классов уязвимостей, бенчмарк против Semgrep, Docker-поставка",
    },
  },
  {
    slug: "bsuir-iis-api",
    title: "BSUIR IIS API",
    eyebrow: "Typed public API client",
    summary:
      "Опубликованный TypeScript ESM SDK для IIS API БГУИР и небольшой Next.js-клиент: расписание, экзамены, справочники. Акцент на контрактах и сопровождении пакета, не на «красивом UI».",
    stack: ["TypeScript", "ESM", "npm", "Next.js"],
    role: "Library Author",
    imageAlt: "BSUIR IIS API — TypeScript SDK",
    repoUrl: "https://github.com/kotru21/bsuir-iis-api",
    cardPeriod: "2025–26",
    cardMeta: "SDK · Maintained",
    cardPattern: "stripes",
    accentColor: "#63ffd5",
    cardIcon: SiTypescript,
    details: {
      challenge: "Стабильный типизированный доступ к университетскому API без ad-hoc fetch-обёрток",
      solution: "ESM-пакет с явными контрактами и showcase-приложение на App Router",
      outcome: "Публичный SDK и поддерживаемый consumer для расписаний и справочников",
    },
  },
  {
    slug: "web-messenger",
    title: "Web Messenger",
    eyebrow: "Auth · trust boundaries",
    summary:
      "Full-stack чат с JWT, публичными и приватными диалогами, медиа и realtime. В витрине — про authn/authz и границы доверия, а не про «приятный UX».",
    stack: ["React", "Node.js", "Express", "MongoDB", "Socket.IO", "JWT"],
    role: "Full-Stack Developer",
    imageSrc: "/projects/web-messenger.png",
    imageAlt: "Web Messenger — JWT и realtime",
    repoUrl: "https://github.com/kotru21/webchat",
    cardPeriod: "2025",
    cardMeta: "Auth · Realtime",
    cardPattern: "dots",
    accentColor: "#00ffb9",
    cardIcon: FaReact,
    details: {
      challenge: "Разделить публичные и приватные каналы и не протечь сессию через realtime-слой",
      solution: "JWT auth, явные границы для Socket.IO-событий, контроль доступа к диалогам",
      outcome: "Рабочий мессенджер с auth, историей и присутствием — полезный кейс для secure review",
    },
  },
];
```

- [ ] **Step 2: Run project tests**

Run: `bun run test -- tests/shared/content.test.ts tests/widgets/projects.test.tsx tests/widgets/ProjectCardDeck.test.tsx`

Expected: PASS for content project slugs and CodeAnalyzer UI assertion.

- [ ] **Step 3: Commit**

```bash
git add src/shared/config/content/projects.ts
git commit -m "feat: showcase CodeAnalyzer, BSUIR IIS API, and Web Messenger"
```

---

### Task 6: Document metadata (layout + manifest)

**Files:**
- Modify: `app/layout.tsx` (title/description/keywords/OG alt only)
- Modify: `app/manifest.ts` (name string only)

- [ ] **Step 1: Update SEO strings in `app/layout.tsx`**

Replace the hardcoded frontend title/description/keywords/OG alt with:

```ts
const siteTitle = `${personData.nameRu} (${personData.nickname}) — SOC / AppSec | Портфолио`;
const siteDescription = `${personData.description}. БГУИР, hoster.by, SAST и безопасная разработка.`;
```

Replace `keywords` array with:

```ts
keywords: [
  "SOC",
  "AppSec",
  "information security",
  "информационная безопасность",
  "DFIR",
  "SAST",
  "OWASP",
  "Python",
  "TypeScript",
  "portfolio",
  "котиков",
  "kotikov",
  "Arsenij Kotikov",
  "Арсений Котиков",
  "hoster.by",
  "БГУИР",
],
```

Replace OG image `alt` with:

```ts
alt: `${personData.nameRu} — SOC / AppSec`,
```

Leave fonts, theme, analytics, and structure untouched.

- [ ] **Step 2: Update `app/manifest.ts` name**

```ts
name: `${personData.name} — SOC / AppSec`,
```

Keep `description: personData.description` (already updated in Task 2).

- [ ] **Step 3: Sanity-check TypeScript build for app entry**

Run: `bun run test`

Expected: all unit tests PASS.

Optional quick grep: `rg -n "Frontend разработчик|Frontend-разработчик|Frontend Developer" app src/shared/config/content` — should return no matches in those paths (README may still say frontend; out of scope).

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/manifest.ts
git commit -m "feat: align document metadata with SOC/AppSec positioning"
```

---

### Task 7: Final verification

**Files:** none new — verification only

- [ ] **Step 1: Run full unit suite**

Run: `bun run test`

Expected: PASS (exit 0).

- [ ] **Step 2: Run lint on touched areas if the repo gate requires it**

Run: `bun run lint`

Expected: no new errors in modified files.

- [ ] **Step 3: Manual checklist against the spec**

Confirm in `bun run dev` (or by reading content modules):

1. Hero eyebrow is `Арсений Котиков · SOC`
2. First project slug/title is CodeAnalyzer
3. Timeline data companies are hoster.by → Innowise → БГУИР; carousel opens on newest (hoster.by)
4. Skill groups are Security & DFIR / Offensive / практика / Development
5. SOC description has no ransomware/AnyDesk/IOC narrative
6. `personData.jobTitle` is `SOC / AppSec`; layout title no longer says Frontend

- [ ] **Step 4: Final commit only if Step 3 found leftover fixes**

If clean, no extra commit. If small copy fixes were needed, commit them:

```bash
git add -A
git commit -m "fix: polish InfoSec content pivot leftovers"
```

---

## Spec coverage checklist

| Spec requirement | Task |
| --- | --- |
| Hero SOC eyebrow + dual subtitle | Task 2 |
| About IB identity + principles | Task 2 |
| personData jobTitle / description / skills | Task 2 |
| Footer IB blurb | Task 2 |
| Timeline hoster / Innowise / БГУИР, no hackathons, careful SOC | Task 3 |
| Timeline leads with hoster (newest-first) | Task 3 sort |
| Skills groups + category union | Task 4 |
| Projects CodeAnalyzer → IIS API → Web Messenger | Task 5 |
| No broken screenshots for missing assets | Task 5 (omit imageSrc) |
| SEO layout/manifest not frontend-primary | Task 6 |
| Tests updated | Tasks 1, 5, 7 |
| No visual redesign / no HTB section / no i18n | Explicitly omitted |

## Self-review notes

- No TBD placeholders in steps; copy is concrete and disclosure-safe.
- Skill icon imports may need a one-line swap if a `react-icons/si` export is missing — names stay fixed for tests.
- README still says frontend; deferred by design non-goals / YAGNI for this plan.
