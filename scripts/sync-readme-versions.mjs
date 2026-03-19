/**
 * Syncs version badges and tech-stack bullets in README*.md from package.json.
 * Run: bun run sync-readme-versions
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkgPath = join(root, "package.json");
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

const nextFull = cleanVersion(pkg.dependencies?.next);
const reactMM = majorMinor(pkg.dependencies?.react);
const tsMM = majorMinor(pkg.devDependencies?.typescript);
const tailwindMM = majorMinor(pkg.devDependencies?.tailwindcss);
const tsFull = cleanVersion(pkg.devDependencies?.typescript);
const tailwindFull = cleanVersion(pkg.devDependencies?.tailwindcss);

const bunFromPm = (pkg.packageManager ?? "").match(/^bun@(.+)$/);
const bunVersion = bunFromPm ? bunFromPm[1] : "1.x";

const badgeLine = `[![Next.js](https://img.shields.io/badge/Next.js-${nextFull}-eafff8?logo=next.js&logoColor=eafff8)](https://nextjs.org/) [![Bun](https://img.shields.io/badge/Bun-${bunVersion}-eafff8?logo=bun&logoColor=eafff8)](https://bun.sh/) [![TypeScript](https://img.shields.io/badge/TypeScript-${tsFull}-eafff8?logo=typescript&logoColor=eafff8)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-${tailwindFull}-eafff8?logo=tailwindcss&&logoColor=eafff8)](https://tailwindcss.com/) [![Vercel](https://img.shields.io/badge/Vercel-Deploy-eafff8?logo=vercel&logoColor=eafff8)](https://vercel.com/)`;

const stackLine = `- Next.js ${majorMinor(nextFull)}, React ${reactMM}, TypeScript ${tsMM}, Tailwind CSS ${tailwindMM}`;
const bunLine = `- Bun (\`bun@${bunVersion}\`)`;

const BADGE_LINE_RE = /^\[!\[Next\.js\][^\n]*$/m;
const STACK_LINE_RE = /^- Next\.js [\d.]+, React [\d.]+, TypeScript [\d.]+, Tailwind CSS [\d.]+$/m;
const BUN_LINE_RE = /^- Bun \(`bun@[\d.]+\`\)$/m;

/** @param {string} filePath */
function patchReadme(filePath) {
  let s = readFileSync(filePath, "utf8");
  const before = s;
  if (!BADGE_LINE_RE.test(s)) {
    console.warn(`skip badges (no Next.js badge line): ${relative(root, filePath)}`);
  } else {
    s = s.replace(BADGE_LINE_RE, badgeLine);
  }
  if (STACK_LINE_RE.test(s)) {
    s = s.replace(STACK_LINE_RE, stackLine);
  }
  if (BUN_LINE_RE.test(s)) {
    s = s.replace(BUN_LINE_RE, bunLine);
  }
  if (s !== before) {
    writeFileSync(filePath, s, "utf8");
    console.log(`updated ${relative(root, filePath)}`);
  }
}

for (const name of ["README.md", "README.ru.md", "README.en.md"]) {
  patchReadme(join(root, name));
}
