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
          "src/features/nyancat/**/*.{ts,tsx}",
          "src/widgets/**/*.{ts,tsx}",
          "src/shared/lib/**/*.{ts,tsx}",
          "src/shared/ui/Card/**/*.{ts,tsx}",
          "src/shared/ui/Section/**/*.{ts,tsx}",
          "src/shared/ui/SectionHeader/**/*.{ts,tsx}",
          "src/shared/ui/Button/**/*.{ts,tsx}",
          "src/shared/ui/Logo.tsx",
          "src/shared/ui/GridPaintOverlay/hooks/useGridCanvas.ts",
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
          "**/client.ts",
          "**/types.ts",
          "**/model/types.ts",
          // Heavy RAF/canvas UI shells stay unit-tested outside the gated include list.
          "src/features/nyancat/ui/ExplosionPixels.tsx",
          "src/features/nyancat/ui/RainbowTrail.tsx",
          "src/features/nyancat/ui/FlyingNyancat.tsx",
          "src/features/nyancat/lib/utils.ts",
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
