import path from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";

const configDir =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/react-vite",
  staticDirs: ["../public"],
  async viteFinal(viteConfig) {
    const { mergeConfig } = await import("vite");
    return mergeConfig(viteConfig, {
      // The root tsconfig sets `jsx: "preserve"` for Next.js, which Vite/esbuild can't
      // parse. Override it so Vite transforms JSX with the automatic runtime.
      esbuild: { jsx: "automatic" },
      // Storybook serves `public/` via `staticDirs`, so disable Vite's own publicDir
      // handling — that lets i18n.ts import the locale JSON from public/ without Vite's
      // "assets in public directory cannot be imported" warning.
      publicDir: false,
      resolve: {
        // Resolve the tsconfig `@/*` aliases (@/components, @/data, @/svg-icons) natively.
        tsconfigPaths: true,
        alias: {
          // @chakra-ui/next-js wraps next/image and needs the Next runtime, which the
          // react-vite builder doesn't provide (Storybook 10 requires Next 14.1+). Stub
          // it for Storybook; the package is removed from the app in PR1.
          "@chakra-ui/next-js": path.join(
            configDir,
            "mocks/chakra-next-js.tsx",
          ),
        },
      },
    });
  },
};

export default config;
