import { configDefaults, defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./tests/setup.ts"],
      css: true,
      exclude: [...configDefaults.exclude, ".worktrees/**", "e2e/**"],
      coverage: {
        provider: "v8",
        reporter: ["text", "lcov"],
        include: [
          "src/features/performance/**/*.{ts,tsx}",
          "src/features/scrolling/**/*.{ts,tsx}",
          "src/features/theme/**/*.{ts,tsx}",
          "src/features/interactive-elements/**/*.{ts,tsx}",
          "src/features/device/**/*.{ts,tsx}",
          "src/widgets/**/*.{ts,tsx}",
          "src/shared/lib/**/*.{ts,tsx}",
          "src/shared/ui/Card/**/*.{ts,tsx}",
          "src/shared/ui/Section/**/*.{ts,tsx}",
          "src/shared/ui/SectionHeader/**/*.{ts,tsx}",
          "src/shared/ui/Button/**/*.{ts,tsx}",
          "src/shared/ui/Logo.tsx",
          "src/shared/ui/hooks/**/*.{ts,tsx}",
          "app/error.tsx",
          "app/not-found.tsx",
          "app/global-error.tsx",
          "app/components/**/*.{ts,tsx}",
        ],
        exclude: [
          "**/*.d.ts",
          "**/index.ts",
          "**/index.tsx",
          "**/types.ts",
          "**/model/types.ts",
          "src/shared/ui/GridPaintOverlay/**",
          "src/features/paw/**",
          "src/features/nyancat/**",
        ],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  })
);
