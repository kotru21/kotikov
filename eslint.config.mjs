// @ts-check

import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import boundariesPlugin from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    // Аналог .eslintignore (flat config)
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "coverage/**",
      ".eslintrc.cjs",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: "project-rules",
    plugins: {
      import: importPlugin,
      "simple-import-sort": simpleImportSortPlugin,
      "unused-imports": unusedImportsPlugin,
      boundaries: boundariesPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
      "boundaries/elements": [
        { type: "shared", pattern: "src/shared/**" },
        { type: "entities", pattern: "src/entities/**" },
        { type: "features", pattern: "src/features/**" },
        { type: "widgets", pattern: "src/widgets/**" },
        { type: "app", pattern: "app/**" },
      ],
    },
    rules: {
      // Не дублируем отчёты: unused-imports уже делает то, что нужно
      "@typescript-eslint/no-unused-vars": "off",

      // Часто полезно, но слишком жёстко для UI-слоя (можно ужесточить позже)
      "@typescript-eslint/no-explicit-any": "warn",

      // Clean imports
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // No dead code
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      // Detect cycles early (barrels + reexports are common sources)
      "import/no-cycle": [
        "error",
        {
          maxDepth: 1,
          ignoreExternal: true,
          allowUnsafeDynamicCyclicDependency: false,
        },
      ],

      // FSD layer boundaries
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "shared", allow: ["shared"] },
            { from: "entities", allow: ["entities", "shared"] },
            { from: "features", allow: ["features", "entities", "shared"] },
            {
              from: "widgets",
              allow: ["widgets", "features", "entities", "shared"],
            },
            {
              from: "app",
              allow: ["app", "widgets", "features", "entities", "shared"],
            },
          ],
        },
      ],
    },
  },
  {
    name: "public-api-only",
    files: [
      "app/**/*.{ts,tsx}",
      "src/**/*.{ts,tsx}",
    ],
    rules: {
      // Public API only (no deep imports via alias)
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/entities",
              message:
                "Public API only: импортируй из '@/entities/<slice>' (например '@/entities/skill').",
            },
            {
              name: "@/entities/header",
              message:
                "Контент переехал в shared: импортируй из '@/shared/config/content' (headerContent), а не из '@/entities/header'.",
            },
            {
              name: "@/entities/footer",
              message:
                "Контент переехал в shared: импортируй из '@/shared/config/content' (footerInfo/footerConfig), а не из '@/entities/footer'.",
            },
            {
              name: "@/entities/person",
              message:
                "Контент переехал в shared: импортируй из '@/shared/config/content' (personData), а не из '@/entities/person'.",
            },
            {
              name: "@/features",
              message:
                "Public API only: импортируй из '@/features/<slice>' (например '@/features/device').",
            },
            {
              name: "@/widgets",
              message:
                "Public API only: импортируй из '@/widgets/<slice>' (а не из '@/widgets').",
            },
            {
              name: "@/shared",
              message:
                "Public API only: не импортируй из '@/shared'. Используй '@/shared/<slice>' (например '@/shared/ui', '@/shared/config/content').",
            },
          ],
          patterns: [
            {
              group: [
                "@/entities/*/data/*",
                "@/entities/*/model/*",
                "@/entities/*/ui/*",
              ],
              message:
                "Public API only: не импортируй внутренности entities (data/model/ui). Используй '@/entities/<slice>'.",
            },
            {
              group: [
                "@/features/*/hooks/*",
                "@/features/*/lib/*",
                "@/features/*/types/*",
                "@/features/*/ui/*",
              ],
              message:
                "Public API only: не импортируй внутренности features (hooks/lib/types/ui). Используй '@/features/<slice>'.",
            },
            {
              group: ["@/shared/ui/*", "@/shared/ui/*/**"],
              message:
                "Public API only: shared/ui импортируется только из '@/shared/ui' (barrel).",
            },
          ],
        },
      ],
    },
  },
  // ВАЖНО: eslint-config-prettier должен быть последним
  eslintConfigPrettier
);

