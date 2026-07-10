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
      exclude: [...configDefaults.exclude, ".worktrees/**"],
      coverage: {
        provider: "v8",
        reporter: ["text", "lcov"],
        include: [
          "src/features/performance/**/*.{ts,tsx}",
          "src/widgets/**/*.{ts,tsx}",
          "app/error.tsx",
          "app/not-found.tsx",
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
