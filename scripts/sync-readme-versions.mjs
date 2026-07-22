/**
 * Syncs README*.md and vercel.json from package.json (Next, React, TS, Tailwind, Bun).
 * Run: bun run sync-readme-versions
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkgPath = join(root, "package.json");
const vercelPath = join(root, "vercel.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

/** @param {string | undefined} v */
function cleanVersion(v) {
  if (!v) return "";
  return String(v).replace(/^[\^~>=\s]+/, "");
}

/** @param {string} semver */
function majorMinor(semver) {
  const c = cleanVersion(semver);
  const [a, b] = c.split(".");
  return b !== undefined ? `${a}.${b}` : c;
}

/** Prefer packageManager; fall back to @types/bun (often bumped with toolchain). */
function resolveBunVersion() {
  const pm = pkg.packageManager ?? "";
  const pmMatch = pm.match(/^bun@(.+)$/);
  if (pmMatch) {
    const raw = pmMatch[1].trim();
    if (/^\d+\.\d+/.test(raw)) return cleanVersion(raw);
    return raw;
  }
  const typesBun = pkg.devDependencies?.["@types/bun"];
  if (typesBun && /^\d+\.\d+/.test(cleanVersion(typesBun))) {
    return cleanVersion(typesBun);
  }
  return "";
}

/** Vercel supports e.g. "1.3.x"; keeps deploy on the same minor as the lockfile. */
function vercelBunRange(bunSemver) {
  if (/^\d+\.\d+\.\d+/.test(bunSemver)) return `${majorMinor(bunSemver)}.x`;
  if (/^\d+\.\d+$/.test(bunSemver)) return `${bunSemver}.x`;
  return "1.x";
}

/** Prefer `@typescript/native` (TS 7) over the TS 6 JS-API package used by eslint. */
function resolveTypeScriptVersion() {
  const native = pkg.devDependencies?.["@typescript/native"];
  if (typeof native === "string") {
    const fromAlias = native.match(/npm:typescript@(.+)$/);
    if (fromAlias) return cleanVersion(fromAlias[1]);
  }
  return cleanVersion(pkg.devDependencies?.typescript);
}

const nextFull = cleanVersion(pkg.dependencies?.next);
const reactMM = majorMinor(pkg.dependencies?.react);
const tsFull = resolveTypeScriptVersion();
const tsMM = majorMinor(tsFull);
const tailwindMM = majorMinor(pkg.devDependencies?.tailwindcss);
const tailwindFull = cleanVersion(pkg.devDependencies?.tailwindcss);

const bunSemver = resolveBunVersion();
const bunForBadge = bunSemver || "1.x";
const bunMM = bunSemver && /^\d+\.\d+/.test(bunSemver) ? majorMinor(bunSemver) : null;

const badgeLine = `[![Next.js](https://img.shields.io/badge/Next.js-${nextFull}-eafff8?logo=next.js&logoColor=eafff8)](https://nextjs.org/) [![Bun](https://img.shields.io/badge/Bun-${bunForBadge}-eafff8?logo=bun&logoColor=eafff8)](https://bun.sh/) [![TypeScript](https://img.shields.io/badge/TypeScript-${tsFull}-eafff8?logo=typescript&logoColor=eafff8)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-${tailwindFull}-eafff8?logo=tailwindcss&&logoColor=eafff8)](https://tailwindcss.com/) [![Vercel](https://img.shields.io/badge/Vercel-Deploy-eafff8?logo=vercel&logoColor=eafff8)](https://vercel.com/)`;

const stackLine = `- Next.js ${majorMinor(nextFull)}, React ${reactMM}, TypeScript ${tsMM}, Tailwind CSS ${tailwindMM}`;
const bunStackLine = `- Bun (\`bun@${bunForBadge}\`)`;
const requirementsLine = bunMM ? `- Bun v${bunMM}+` : `- Bun v1.x`;

// --- vercel.json ---
let vercel = {};
let vercelBefore = "";
try {
  vercelBefore = readFileSync(vercelPath, "utf8");
  vercel = JSON.parse(vercelBefore);
} catch {
  vercel = {};
}

const nextVercelBun =
  bunSemver && /^\d+\.\d+/.test(bunSemver)
    ? vercelBunRange(bunSemver)
    : (vercel.bunVersion ?? "1.x");

const vercelSerialized = `${JSON.stringify({ ...vercel, bunVersion: nextVercelBun }, null, 2)}\n`;
if (vercelBefore !== vercelSerialized) {
  writeFileSync(vercelPath, vercelSerialized, "utf8");
  console.log(`updated ${relative(root, vercelPath)}`);
}

const vercelBun = JSON.parse(readFileSync(vercelPath, "utf8")).bunVersion ?? "1.x";

const BADGE_LINE_RE = /^\[!\[Next\.js\][^\n]*$/m;
const STACK_LINE_RE = /^- Next\.js [\d.]+, React [\d.]+, TypeScript [\d.]+, Tailwind CSS [\d.]+$/m;
const BUN_STACK_LINE_RE = /^- Bun \(`bun@[^`]+\`\)$/m;
const REQUIREMENTS_LINE_RE = /^- Bun v[^\n]+$/m;
const VERCEL_BUN_IN_BACKTICKS_RE = /`bunVersion: [^`]+`/g;

/** @param {string} filePath */
function patchReadme(filePath) {
  let s = readFileSync(filePath, "utf8");
  const before = s;

  if (!BADGE_LINE_RE.test(s)) {
    console.warn(`skip badges (no Next.js badge line): ${relative(root, filePath)}`);
  } else {
    s = s.replace(BADGE_LINE_RE, badgeLine);
  }
  if (!STACK_LINE_RE.test(s)) {
    console.warn(`skip stack line (no match): ${relative(root, filePath)}`);
  } else {
    s = s.replace(STACK_LINE_RE, stackLine);
  }
  if (!BUN_STACK_LINE_RE.test(s)) {
    console.warn(`skip bun stack line (no match): ${relative(root, filePath)}`);
  } else {
    s = s.replace(BUN_STACK_LINE_RE, bunStackLine);
  }
  if (!REQUIREMENTS_LINE_RE.test(s)) {
    console.warn(`skip requirements line (no match): ${relative(root, filePath)}`);
  } else {
    s = s.replace(REQUIREMENTS_LINE_RE, requirementsLine);
  }
  s = s.replace(VERCEL_BUN_IN_BACKTICKS_RE, `\`bunVersion: ${vercelBun}\``);

  if (bunMM) {
    s = s.split("Bun v1.x").join(`Bun v${bunMM}+`);
  }

  if (s !== before) {
    writeFileSync(filePath, s, "utf8");
    console.log(`updated ${relative(root, filePath)}`);
  }
}

for (const name of ["README.md", "README.ru.md", "README.en.md"]) {
  patchReadme(join(root, name));
}
