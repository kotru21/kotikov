// @ts-check

import eslint from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import boundariesPlugin from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default defineConfig(
  // ═══════════════════════════════════════════════════════════════════════════
  // IGNORES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "coverage/**",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BASE CONFIGS
  // ═══════════════════════════════════════════════════════════════════════════
  eslint.configs.recommended,

  // Strict TypeScript rules with type checking
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.mjs", "eslint.config.mjs"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONFIG FILES (relaxed rules for ESLint plugins without proper types)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "config-files",
    files: ["*.config.{js,mjs,ts}", "*.config.*.{js,mjs,ts}"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-return": "off",
    },
  },


  // ═══════════════════════════════════════════════════════════════════════════
  // NEXT.JS, REACT & ACCESSIBILITY RULES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "next-react-a11y",
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      // @ts-expect-error - react-hooks plugin has incompatible flat config types
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // ─────────────────────────────────────────────────────────────────────────
      // Next.js rules
      // ─────────────────────────────────────────────────────────────────────────
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@next/next/no-html-link-for-pages": "error",

      // ─────────────────────────────────────────────────────────────────────────
      // React rules
      // ─────────────────────────────────────────────────────────────────────────
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "react/prop-types": "off", // Using TypeScript
      "react/jsx-no-target-blank": "error",
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" },
      ],
      "react/self-closing-comp": ["error", { component: true, html: true }],
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-no-useless-fragment": "error",
      "react/no-array-index-key": "warn",
      "react/hook-use-state": "error",
      "react/no-unknown-property": ["error", { ignore: ["jsx", "global"] }], // styled-jsx
      "react/jsx-no-leaked-render": ["error", { validStrategies: ["ternary", "coerce"] }],
      "react/iframe-missing-sandbox": "error",
      "react/jsx-pascal-case": ["error", { allowAllCaps: false }],
      "react/no-danger": "warn",
      "react/no-unstable-nested-components": ["error", { allowAsProps: false }],
      "react/jsx-no-constructed-context-values": "error",
      "react/jsx-key": ["error", { checkFragmentShorthand: true, warnOnDuplicates: true }],

      // ─────────────────────────────────────────────────────────────────────────
      // React Hooks rules (critical for correctness)
      // ─────────────────────────────────────────────────────────────────────────
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // ─────────────────────────────────────────────────────────────────────────
      // Accessibility rules
      // ─────────────────────────────────────────────────────────────────────────
      ...jsxA11yPlugin.configs.strict.rules,
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: ["Link"],
          specialLink: ["hrefLeft", "hrefRight"],
          aspects: ["invalidHref", "preferButton"],
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TYPESCRIPT STRICT RULES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "typescript-strict",
    files: ["**/*.{ts,tsx}"],
    rules: {
      // Disabled in favor of unused-imports plugin
      "@typescript-eslint/no-unused-vars": "off",

      // ─────────────────────────────────────────────────────────────────────────
      // Strict type safety
      // ─────────────────────────────────────────────────────────────────────────
      "@typescript-eslint/no-deprecated": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: true,
          allowNullableBoolean: false,
          allowNullableString: false,
          allowNullableNumber: false,
          allowAny: false,
        },
      ],

      // ─────────────────────────────────────────────────────────────────────────
      // Consistency & style
      // ─────────────────────────────────────────────────────────────────────────
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "@typescript-eslint/consistent-type-exports": [
        "error",
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: true,
        },
      ],
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/method-signature-style": ["error", "property"],
      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/prefer-enum-initializers": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",

      // ─────────────────────────────────────────────────────────────────────────
      // Naming conventions for FSD
      // ─────────────────────────────────────────────────────────────────────────
      "@typescript-eslint/naming-convention": [
        "error",
        // Default: camelCase
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        // Variables: camelCase or UPPER_CASE (for constants)
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        // Functions: camelCase (or PascalCase for React components)
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        // Parameters: camelCase
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        // Types, Interfaces, Classes: PascalCase
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        // Enum members: PascalCase or UPPER_CASE
        {
          selector: "enumMember",
          format: ["PascalCase", "UPPER_CASE"],
        },
        // Import: allow both for libraries
        {
          selector: "import",
          format: ["camelCase", "PascalCase"],
        },
        // Object properties: allow flexibility for APIs
        {
          selector: "objectLiteralProperty",
          format: null,
        },
      ],

      // ─────────────────────────────────────────────────────────────────────────
      // Best practices
      // ─────────────────────────────────────────────────────────────────────────
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false, // Allow async onClick handlers
          },
        },
      ],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/switch-exhaustiveness-check": [
        "error",
        {
          allowDefaultCaseForExhaustiveSwitch: false,
          requireDefaultForNonUnion: true,
        },
      ],
      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        {
          ignoreArrowShorthand: true,
          ignoreVoidOperator: true,
        },
      ],
      "@typescript-eslint/no-meaningless-void-operator": "error",
      "@typescript-eslint/no-mixed-enums": "error",
      "@typescript-eslint/no-redundant-type-constituents": "error",
      "@typescript-eslint/prefer-reduce-type-parameter": "error",
      "@typescript-eslint/prefer-return-this-type": "error",
      "@typescript-eslint/unified-signatures": "error",
      "@typescript-eslint/use-unknown-in-catch-callback-variable": "error",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // IMPORT & FSD RULES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "imports-and-fsd",
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
      // ─────────────────────────────────────────────────────────────────────────
      // Import sorting
      // ─────────────────────────────────────────────────────────────────────────
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // ─────────────────────────────────────────────────────────────────────────
      // No dead code
      // ─────────────────────────────────────────────────────────────────────────
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

      // ─────────────────────────────────────────────────────────────────────────
      // Import hygiene
      // ─────────────────────────────────────────────────────────────────────────
      "import/no-duplicates": ["error", { "prefer-inline": true }],
      "import/no-self-import": "error",
      "import/no-useless-path-segments": ["error", { noUselessIndex: true }],
      "import/no-mutable-exports": "error",
      "import/first": "error",
      "import/newline-after-import": "error",

      // Detect cycles (increased depth for thorough checking)
      "import/no-cycle": [
        "error",
        {
          maxDepth: 5,
          ignoreExternal: true,
          allowUnsafeDynamicCyclicDependency: false,
        },
      ],

      // ─────────────────────────────────────────────────────────────────────────
      // FSD layer boundaries
      // ─────────────────────────────────────────────────────────────────────────
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

      // FSD public API enforcement (entry points only)
      "boundaries/entry-point": [
        "error",
        {
          default: "disallow",
          rules: [
            // Shared segments can have multiple entry points
            {
              target: ["shared"],
              allow: [
                "index.ts",
                "index.tsx",
                // Allow direct access to shared config
                "config/**",
                "lib/**",
                "ui/**",
                "styles/**",
              ],
            },
            // Slices only through index
            {
              target: ["entities", "features", "widgets"],
              // allow entry points in subfolders (e.g. 'skills/index.ts')
              // restricted to one-level deep to avoid exposing internal subfolders
              allow: ["index.ts", "index.tsx", "*/index.ts", "*/index.tsx"],
            },
            // App layer is flexible
            {
              target: ["app"],
              allow: "**",
            },
          ],
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC API ENFORCEMENT (FSD) - no-restricted-imports
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "public-api-only",
    files: ["app/**/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
    rules: {
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
                "Контент переехал в shared: импортируй из '@/shared/config/content' (headerContent).",
            },
            {
              name: "@/entities/footer",
              message:
                "Контент переехал в shared: импортируй из '@/shared/config/content' (footerInfo/footerConfig).",
            },
            {
              name: "@/entities/person",
              message:
                "Контент переехал в shared: импортируй из '@/shared/config/content' (personData).",
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
                "Public API only: используй '@/shared/<segment>' (например '@/shared/ui', '@/shared/config/content').",
            },
          ],
          patterns: [
            // Entities internals
            {
              group: [
                "@/entities/*/data/*",
                "@/entities/*/model/*",
                "@/entities/*/ui/*",
              ],
              message:
                "Public API only: не импортируй внутренности entities (data/model/ui). Используй '@/entities/<slice>'.",
            },
            // Features internals
            {
              group: [
                "@/features/*/hooks/*",
                "@/features/*/lib/*",
                "@/features/*/types/*",
                "@/features/*/ui/*",
                "@/features/*/model/*",
              ],
              message:
                "Public API only: не импортируй внутренности features (hooks/lib/types/ui/model). Используй '@/features/<slice>'.",
            },
            // Shared UI internals (only barrel import allowed)
            {
              group: ["@/shared/ui/*/*", "@/shared/ui/*/*/*"],
              message:
                "Public API only: shared/ui импортируется только из '@/shared/ui' или '@/shared/ui/<component>'.",
            },
            // Shared lib internals
            {
              group: ["@/shared/lib/*/*", "@/shared/lib/*/*/*"],
              message:
                "Public API only: shared/lib импортируется только из '@/shared/lib' или '@/shared/lib/<module>'.",
            },
            // Widgets internals
            {
              group: ["@/widgets/*/ui/*", "@/widgets/*/model/*"],
              message:
                "Public API only: не импортируй внутренности widgets (ui/model). Используй '@/widgets/<slice>'.",
            },
          ],
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL CODE QUALITY RULES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "code-quality",
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      // Prevent common mistakes
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",

      // Code style
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": ["error", "always"],
      "prefer-template": "error",
      "prefer-arrow-callback": ["error", { allowNamedFunctions: false }],
      "no-param-reassign": ["error", { props: false }],
      "no-nested-ternary": "warn",
      "no-unneeded-ternary": "error",

      // Array methods
      "array-callback-return": ["error", { checkForEach: true }],
      "prefer-spread": "error",

      // Control flow
      "no-lonely-if": "error",
      "no-else-return": ["error", { allowElseIf: false }],
      "no-useless-return": "error",
      curly: ["error", "all"],
      eqeqeq: ["error", "always"],

      // Error handling
      "no-throw-literal": "error",
      "prefer-promise-reject-errors": "error",

      // Performance hints
      "no-await-in-loop": "warn",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ESLINT-CONFIG-PRETTIER (must be last)
  // ═══════════════════════════════════════════════════════════════════════════
  eslintConfigPrettier
);