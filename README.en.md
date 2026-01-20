# Kotikov — Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?logo=next.js)](https://nextjs.org/) [![Bun](https://img.shields.io/badge/Bun-1.3.6-000?logo=bun)](https://bun.sh/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/) [![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)](https://vercel.com/)

Kotikov portfolio — a modern frontend developer site built with Next.js, TypeScript and Tailwind.

---

## Demo

| Light | Dark |
| --- | --- |
| ![Kotikov — Screenshot (Light)](./public/screenshot-light.png) | ![Kotikov — Screenshot (Dark)](./public/screenshot-dark.png) |

---

## Quick Start

### Prerequisites

- Bun v1.x

### Install

```bash
git clone https://github.com/kotru21/kotikov.git
cd kotikov
bun install
```

### Run

- Dev: `bun run dev`
- Build: `bun run build`
- Start: `bun run start`
- Lint: `bun run lint`

---

## Showcase

| File | Description |
| --- | --- |
| `app/page.tsx` | Main page — Header, Skills, Timeline, Contacts. |
| `src/widgets/header/HeaderWidget.tsx` | Interactive header with Nyancat and canvas effects. |
| `src/features/nyancat/*` | Nyancat — animation and explosion effects. |
| `src/widgets/skills/SkillsWidget.tsx` | Responsive skills block (desktop + mobile scroll). |
| `src/widgets/timeline/TimelineWidget.tsx` | Timeline of experience and projects. |
| `src/widgets/contacts/ContactsWidget.tsx` | Contacts with paw animation. |
| `package.json` | Scripts and Bun. |
| `vercel.json`, `next.config.ts`, `tailwind.config.ts`, `eslint.config.mjs`, `tsconfig.json` | Configs: deployment, images, theme, ESLint and TypeScript. |

---

## Tech Stack

- Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4  
- Bun (`bun@1.3.6`)  
- Vercel (Analytics, Speed Insights)  
- ESLint (strict TypeScript / FSD rules)

---

## Deployment

Deploy on Vercel: `vercel.json` contains `bunVersion: 1.x` — ensure Vercel uses Bun v1.x.  
Build command: `bun run build`.

---

## Contributing

- Run `bun run lint` before PRs (`eslint.config.mjs`).  
- PRs: fork → branch → PR.

---

## Contact

- Website: [ktkv.me](https://ktkv.me)  
- GitHub: [github.com/kotru21/kotikov](https://github.com/kotru21/kotikov)  
- LinkedIn: [linkedin.ktkv.me](https://linkedin.ktkv.me)  
- Email: [inbox@ktkv.me](mailto:inbox@ktkv.me)
