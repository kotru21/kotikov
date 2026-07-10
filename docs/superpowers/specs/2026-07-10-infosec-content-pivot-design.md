# Design: InfoSec content pivot for ktkv.me

**Date:** 2026-07-10  
**Status:** Approved for planning  
**Scope:** Content + light section data adjustments (no visual redesign)

## Problem

The live site ([ktkv.me](https://ktkv.me)) still presents Arsenij Kotikov as a **frontend developer**. The owner has moved into information security: BSUIR InfoSec student, **SOC Analyst Intern at hoster.by**, AppSec practice (SAST / CodeAnalyzer, HTB). Recruiters and SOC/AppSec teams reading the site get the wrong signal in the first seconds.

## Goals

- In ~10 seconds the site reads as an InfoSec profile (SOC + AppSec), not a frontend portfolio.
- Strong project showcase with **CodeAnalyzer** first.
- Russian-only copy; brand remains **Kotikov**.
- Keep existing UI, motion, and section shells; change content and content-driven labels/data.

## Non-goals

- Visual redesign or new “security” aesthetic
- i18n / English site
- New HTB / CTF section
- Renaming brand to Batura
- Publishing detailed write-ups of the live ransomware case at hoster.by

## Decisions (locked)

| Topic | Choice |
| --- | --- |
| Audience | Recruiters and SOC/AppSec teams — full IB pivot |
| Narrative | SOC and AppSec equally |
| Language | Russian only |
| Brand | Арсений Котиков / Kotikov |
| Hero eyebrow | `Арсений Котиков · SOC` |
| Hero tone | Short InfoSec frame: DFIR/SOC + app vulns / secure development; details below |
| Projects | 1) CodeAnalyzer 2) BSUIR IIS API 3) Web Messenger |
| Frontend projects | Kept only where they serve the showcase (IIS API + Web Messenger), written through a security/engineering lens — not “pretty UI” |
| SOC disclosure | Careful: role, DFIR stack, task types — no incident timeline, IOCs, or case specifics |
| Hackathons in timeline | Remove (ByChange, MTS) |
| Page section order | Unchanged: Header → About → Projects → Skills → Experience → Contacts |
| Implementation style | Security-first content swap in `src/shared/config/content/*` + type/test updates as needed |

## Architecture

Content remains the single source of truth under Feature-Sliced Design:

```
src/shared/config/content/
  header.ts      → hero eyebrow / title / subtitle / CTAs
  about.ts       → body, spec fields, principles
  person.ts      → SEO / structured data identity
  projects.ts    → project cards (order = showcase priority)
  skill.ts       → skillsData + skillGroups
  timeline.ts    → experience / education entries
  footer.ts      → footer blurb
  navigation.ts  → keep anchors; labels only if misleading
```

Entities re-export from this layer (`entities/*/data/*`). Widgets consume content; **do not** redesign widgets unless a type or field shape forces a minimal fix (e.g. skill `category` union).

### Skill categories

Replace Frontend / Backend / Tools with:

1. **Security & DFIR** — OWASP, SAST, IR, forensics tooling, ATT&CK (representative, not a full CV dump)
2. **Offensive / практика** — Burp, web exploitation stack used in HTB practice
3. **Development** — Python, TypeScript/React, FastAPI as AppSec-enabling tools

Update `src/entities/skill/model/types.ts` category union to match. Marquee icons: reuse `react-icons` where possible; prefer clarity over exhaustive coverage (~6–10 marquee items is enough).

## Content specifications

### Hero (`header.ts`)

- **eyebrow:** `Арсений Котиков · SOC`
- **title:** `Kotikov` (unchanged)
- **subtitle:** Short dual narrative — SOC/DFIR practice + application security / secure development; invite to projects and experience below. No ransomware case details.
- **CTAs:** keep “Связаться” → `#contacts`, “Смотреть проекты” → `#projects`

### About (`about.ts`)

- Role field and body: InfoSec student (BSUIR), Intern SOC @ hoster.by, AppSec interest; frontend background as advantage for secure code review — not as primary identity.
- Principles: rewrite toward clarity, careful disclosure, and engineering rigor in security work (three short items, same shape as today).

### Person / SEO (`person.ts`)

- `jobTitle`: `SOC / AppSec` (English string for structured data, consistent with current `personData` style)
- `description`: Russian InfoSec-focused blurb; must not lead with frontend as the primary role
- `skills`: security-first list aligned with the three skill groups below

### Projects (`projects.ts`) — order matters

1. **CodeAnalyzer** (hero card)  
   - SAST for JS/TS, taint analysis, OWASP-oriented rules, SARIF, Semgrep benchmarking angle  
   - Repo: CodeAnalyzerPython (as in resume)  
   - Role framing: AppSec / tooling author  
   - details: challenge → solution → outcome in security language

2. **BSUIR IIS API** (`bsuir-iis-api` + related showcase app)  
   - Published TypeScript ESM SDK for the BSUIR IIS API, plus a small Next.js consumer (schedules / exams / directory)  
   - Engineering lens for an IB audience: public API client design, typed contracts, packaging/maintenance — do **not** invent security features the project does not have; do **not** sell it as a “pretty schedule UI”

3. **Web Messenger** (`webchat`)  
   - JWT auth, realtime, private/public chats  
   - Security lens: authn/authz, token handling, trust boundaries — not “realtime UX”

Remove from showcase: File Manager, TikTok Analyzer (and any other current cards).

Card chrome (patterns, accent colors, optional screenshots): reuse existing card model; new slugs/images only if assets exist — otherwise pattern + icon without broken `imageSrc`.

### Timeline (`timeline.ts`)

Keep three entries (newest-first or existing sort convention in the widget):

1. **SOC Analyst Intern — hoster.by** (2026 — н.в., `work`)  
   Careful copy: hands-on DFIR / triage / case workflow; tools at category level (e.g. timeline analysis, network forensics, IR platform); **no** attack chain, victim details, or novel findings write-up.

2. **Frontend Intern — Innowise** (2025, `work`)  
   Short; engineering background only.

3. **BSUIR — Информационная безопасность** (2024 — н.в., `education`)

Remove hackathon entries.

### Footer (`footer.ts`)

Replace frontend-centric description with SOC / AppSec positioning consistent with hero.

### Navigation

Keep the same hrefs. Labels may stay as-is (`Обо мне`, `Проекты`, `Навыки`, `Опыт`, `Контакты`) unless a label actively contradicts the new identity (none currently do).

## Data flow

```
content modules → widgets (Header, About, Projects, Skills, Timeline, Footer)
               → personData → StructuredData / metadata
```

No new APIs, CMS, or runtime content loading.

## Error handling and disclosure

- Public copy must not include confidential incident details from hoster.by.
- Prefer role + capability language over case narratives.
- If a project repo URL or screenshot is missing, ship the card with repo link and pattern art rather than a broken image.

## Testing

- Update `tests/shared/content.test.ts` expectations for `skillGroups` and any identity assertions.
- Update widget tests that assert old project titles (e.g. File Manager) or frontend-only copy.
- Timeline fixture tests that hardcode titles remain valid if they use local mocks; only fix tests that import live content.
- Run unit tests after content swap; no e2e redesign expected unless copy selectors break.

## Success criteria

- Hero eyebrow shows SOC; subtitle is InfoSec dual-role, not frontend marketing.
- First project card is CodeAnalyzer; showcase is exactly the three locked projects.
- Timeline leads with hoster.by SOC (careful), then Innowise, then BSUIR; no hackathons.
- Skills groups are Security & DFIR / Offensive / Development.
- SEO/person and footer no longer claim frontend as the primary role.
- Existing layout and motion behave as before.

## Out of scope follow-ups (explicitly deferred)

- Dedicated HTB / write-ups section
- English locale
- Visual “security” theme pass
- Deep case studies of client or employer incidents
