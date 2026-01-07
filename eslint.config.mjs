// @ts-check

import eslint from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import boundariesPlugin from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";
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
      ".eslintrc.cjs",
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
  // NEXT.JS & REACT RULES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "next-and-react",
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      // @ts-expect-error - react-hooks plugin has incompatible flat config types
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Next.js rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@next/next/no-html-link-for-pages": "error",

      // React rules
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "react/prop-types": "off", // Using TypeScript
      "react/jsx-no-target-blank": "error",
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
      "react/self-closing-comp": ["error", { component: true, html: true }],
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-no-useless-fragment": "error",
      "react/no-array-index-key": "warn",
      "react/hook-use-state": "error",
      "react/no-unknown-property": ["error", { ignore: ["jsx", "global"] }], // styled-jsx in Next.js

      // React Hooks rules (critical for correctness)
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
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
      
      // Strict type safety
      "@typescript-eslint/no-deprecated": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/strict-boolean-expressions": ["error", {
        allowString: false,
        allowNumber: false,
        allowNullableObject: true,
        allowNullableBoolean: false,
        allowNullableString: false,
        allowNullableNumber: false,
        allowAny: false,
      }],
      
      // Consistency
      "@typescript-eslint/consistent-type-imports": ["error", {
        prefer: "type-imports",
        fixStyle: "separate-type-imports",
      }],
      "@typescript-eslint/consistent-type-exports": ["error", {
        fixMixedExportsWithInlineTypeSpecifier: true,
      }],
      "@typescript-eslint/explicit-function-return-type": ["warn", {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
        allowDirectConstAssertionInArrowFunctions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
      }],
      
      // Naming conventions for FSD
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
      
      // Best practices
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
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

  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC API ENFORCEMENT (FSD)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "public-api-only",
    files: ["app/**/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
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
                "@/features/*/model/*",
              ],
              message:
                "Public API only: не импортируй внутренности features (hooks/lib/types/ui/model). Используй '@/features/<slice>'.",
            },
            {
              group: ["@/shared/ui/*", "@/shared/ui/*/**"],
              message:
                "Public API only: shared/ui импортируется только из '@/shared/ui' (barrel).",
            },
            {
              group: ["@/shared/lib/*", "@/shared/lib/*/**"],
              message:
                "Public API only: shared/lib импортируется только из '@/shared/lib' (barrel).",
            },
            {
              group: [
                "@/widgets/*/ui/*",
                "@/widgets/*/model/*",
              ],
              message:
                "Public API only: не импортируй внутренности widgets (ui/model). Используй '@/widgets/<slice>'.",
            },
          ],
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ESLINT-CONFIG-PRETTIER (must be last)
  // ═══════════════════════════════════════════════════════════════════════════
  eslintConfigPrettier
);

